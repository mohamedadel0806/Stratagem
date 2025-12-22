"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GovernanceScheduleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceScheduleService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const governance_trend_service_1 = require("./governance-trend.service");
const policy_entity_1 = require("../policies/entities/policy.entity");
const policy_entity_2 = require("../policies/entities/policy.entity");
const influencer_entity_1 = require("../influencers/entities/influencer.entity");
const influencer_entity_2 = require("../influencers/entities/influencer.entity");
const sop_entity_1 = require("../sops/entities/sop.entity");
const assessment_entity_1 = require("../assessments/entities/assessment.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
const dashboard_email_service_1 = require("./dashboard-email.service");
let GovernanceScheduleService = GovernanceScheduleService_1 = class GovernanceScheduleService {
    constructor(trendService, policyRepository, influencerRepository, sopRepository, assessmentRepository, notificationService, dashboardEmailService) {
        this.trendService = trendService;
        this.policyRepository = policyRepository;
        this.influencerRepository = influencerRepository;
        this.sopRepository = sopRepository;
        this.assessmentRepository = assessmentRepository;
        this.notificationService = notificationService;
        this.dashboardEmailService = dashboardEmailService;
        this.logger = new common_1.Logger(GovernanceScheduleService_1.name);
    }
    async captureGovernanceSnapshot() {
        try {
            this.logger.debug('Starting daily governance snapshot capture...');
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            await this.trendService.ensureSnapshotForDate(today);
            this.logger.log(`✅ Daily snapshot captured for ${today.toISOString().split('T')[0]}`);
        }
        catch (error) {
            this.logger.error('Failed to capture daily governance snapshot', error.stack);
        }
    }
    async checkPolicyReviewReminders() {
        this.logger.log('Checking for policy review reminders...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const reminderDays = [90, 60, 30, 7, 1];
            for (const daysAhead of reminderDays) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + daysAhead);
                const policies = await this.policyRepository
                    .createQueryBuilder('policy')
                    .where('policy.next_review_date = :targetDate', { targetDate })
                    .andWhere('policy.status IN (:...statuses)', {
                    statuses: [policy_entity_2.PolicyStatus.APPROVED, policy_entity_2.PolicyStatus.PUBLISHED],
                })
                    .leftJoinAndSelect('policy.owner', 'owner')
                    .getMany();
                for (const policy of policies) {
                    if (policy.owner_id) {
                        try {
                            await this.notificationService.create({
                                userId: policy.owner_id,
                                type: notification_entity_1.NotificationType.POLICY_REVIEW_REQUIRED,
                                priority: daysAhead <= 30 ? notification_entity_1.NotificationPriority.HIGH : notification_entity_1.NotificationPriority.MEDIUM,
                                title: `Policy Review Due in ${daysAhead} Days`,
                                message: `Policy "${policy.title}" is scheduled for review on ${policy.next_review_date.toLocaleDateString()}. Please initiate the review process.`,
                                entityType: 'policy',
                                entityId: policy.id,
                                actionUrl: `/dashboard/governance/policies/${policy.id}`,
                                metadata: {
                                    daysUntilReview: daysAhead,
                                    reviewDate: policy.next_review_date.toISOString(),
                                },
                            });
                            this.logger.log(`Sent ${daysAhead}-day reminder for policy ${policy.id} to user ${policy.owner_id}`);
                        }
                        catch (error) {
                            this.logger.error(`Failed to send reminder for policy ${policy.id}:`, error);
                        }
                    }
                }
            }
            const overduePolicies = await this.policyRepository
                .createQueryBuilder('policy')
                .where('policy.next_review_date <= :today', { today })
                .andWhere('policy.status IN (:...statuses)', {
                statuses: [policy_entity_2.PolicyStatus.APPROVED, policy_entity_2.PolicyStatus.PUBLISHED],
            })
                .leftJoinAndSelect('policy.owner', 'owner')
                .getMany();
            for (const policy of overduePolicies) {
                if (policy.owner_id) {
                    const daysOverdue = Math.floor((today.getTime() - new Date(policy.next_review_date).getTime()) / (1000 * 60 * 60 * 24));
                    try {
                        await this.notificationService.create({
                            userId: policy.owner_id,
                            type: notification_entity_1.NotificationType.POLICY_REVIEW_REQUIRED,
                            priority: notification_entity_1.NotificationPriority.HIGH,
                            title: `Policy Review Overdue`,
                            message: `Policy "${policy.title}" review is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue. Please complete the review immediately.`,
                            entityType: 'policy',
                            entityId: policy.id,
                            actionUrl: `/dashboard/governance/policies/${policy.id}`,
                            metadata: {
                                daysOverdue,
                                reviewDate: policy.next_review_date.toISOString(),
                            },
                        });
                        this.logger.log(`Sent overdue reminder for policy ${policy.id} to user ${policy.owner_id}`);
                    }
                    catch (error) {
                        this.logger.error(`Failed to send overdue reminder for policy ${policy.id}:`, error);
                    }
                }
            }
            this.logger.log('Policy review reminders check completed');
        }
        catch (error) {
            this.logger.error('Error checking policy review reminders:', error);
        }
    }
    async checkInfluencerReviewReminders() {
        this.logger.log('Checking for influencer review reminders...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const reminderDays = [90, 60, 30, 7, 1];
            for (const daysAhead of reminderDays) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + daysAhead);
                const influencers = await this.influencerRepository
                    .createQueryBuilder('influencer')
                    .where('influencer.next_review_date = :targetDate', { targetDate })
                    .andWhere('influencer.status IN (:...statuses)', {
                    statuses: [influencer_entity_2.InfluencerStatus.ACTIVE],
                })
                    .leftJoinAndSelect('influencer.owner', 'owner')
                    .getMany();
                for (const influencer of influencers) {
                    if (influencer.owner_id) {
                        try {
                            await this.notificationService.create({
                                userId: influencer.owner_id,
                                type: notification_entity_1.NotificationType.GENERAL,
                                priority: daysAhead <= 30 ? notification_entity_1.NotificationPriority.HIGH : notification_entity_1.NotificationPriority.MEDIUM,
                                title: `Influencer Review Due in ${daysAhead} Days`,
                                message: `Influencer "${influencer.name}" is scheduled for review on ${influencer.next_review_date.toLocaleDateString()}. Please review and update as needed.`,
                                entityType: 'influencer',
                                entityId: influencer.id,
                                actionUrl: `/dashboard/governance/influencers/${influencer.id}`,
                                metadata: {
                                    daysUntilReview: daysAhead,
                                    reviewDate: influencer.next_review_date.toISOString(),
                                },
                            });
                            this.logger.log(`Sent ${daysAhead}-day reminder for influencer ${influencer.id} to user ${influencer.owner_id}`);
                        }
                        catch (error) {
                            this.logger.error(`Failed to send reminder for influencer ${influencer.id}:`, error);
                        }
                    }
                }
            }
            const overdueInfluencers = await this.influencerRepository
                .createQueryBuilder('influencer')
                .where('influencer.next_review_date <= :today', { today })
                .andWhere('influencer.status IN (:...statuses)', {
                statuses: [influencer_entity_2.InfluencerStatus.ACTIVE],
            })
                .leftJoinAndSelect('influencer.owner', 'owner')
                .getMany();
            for (const influencer of overdueInfluencers) {
                if (influencer.owner_id) {
                    const daysOverdue = Math.floor((today.getTime() - new Date(influencer.next_review_date).getTime()) / (1000 * 60 * 60 * 24));
                    try {
                        await this.notificationService.create({
                            userId: influencer.owner_id,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.HIGH,
                            title: `Influencer Review Overdue`,
                            message: `Influencer "${influencer.name}" review is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue. Please complete the review immediately.`,
                            entityType: 'influencer',
                            entityId: influencer.id,
                            actionUrl: `/dashboard/governance/influencers/${influencer.id}`,
                            metadata: {
                                daysOverdue,
                                reviewDate: influencer.next_review_date.toISOString(),
                            },
                        });
                        this.logger.log(`Sent overdue reminder for influencer ${influencer.id} to user ${influencer.owner_id}`);
                    }
                    catch (error) {
                        this.logger.error(`Failed to send overdue reminder for influencer ${influencer.id}:`, error);
                    }
                }
            }
            this.logger.log('Influencer review reminders check completed');
        }
        catch (error) {
            this.logger.error('Error checking influencer review reminders:', error);
        }
    }
    async checkSOPReviewReminders() {
        this.logger.log('Checking for SOP review reminders...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const reminderDays = [90, 60, 30, 7, 1];
            for (const daysAhead of reminderDays) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + daysAhead);
                const sops = await this.sopRepository
                    .createQueryBuilder('sop')
                    .where('sop.next_review_date = :targetDate', { targetDate })
                    .andWhere('sop.status IN (:...statuses)', {
                    statuses: [sop_entity_1.SOPStatus.APPROVED, sop_entity_1.SOPStatus.PUBLISHED],
                })
                    .leftJoinAndSelect('sop.owner', 'owner')
                    .getMany();
                for (const sop of sops) {
                    if (sop.owner_id) {
                        try {
                            await this.notificationService.create({
                                userId: sop.owner_id,
                                type: notification_entity_1.NotificationType.GENERAL,
                                priority: daysAhead <= 7 ? notification_entity_1.NotificationPriority.HIGH : notification_entity_1.NotificationPriority.MEDIUM,
                                title: `SOP Review Due in ${daysAhead} Days`,
                                message: `Standard Operating Procedure "${sop.title}" is scheduled for review on ${sop.next_review_date.toLocaleDateString()}. Please initiate the review process.`,
                                entityType: 'sop',
                                entityId: sop.id,
                                actionUrl: `/dashboard/governance/sops/${sop.id}`,
                                metadata: {
                                    daysUntilReview: daysAhead,
                                    reviewDate: sop.next_review_date.toISOString(),
                                },
                            });
                            this.logger.log(`Sent ${daysAhead}-day reminder for SOP ${sop.id} to user ${sop.owner_id}`);
                        }
                        catch (error) {
                            this.logger.error(`Failed to send reminder for SOP ${sop.id}:`, error);
                        }
                    }
                }
            }
            const overdueSOPs = await this.sopRepository
                .createQueryBuilder('sop')
                .where('sop.next_review_date <= :today', { today })
                .andWhere('sop.status IN (:...statuses)', {
                statuses: [sop_entity_1.SOPStatus.APPROVED, sop_entity_1.SOPStatus.PUBLISHED],
            })
                .leftJoinAndSelect('sop.owner', 'owner')
                .getMany();
            for (const sop of overdueSOPs) {
                if (sop.owner_id) {
                    const daysOverdue = Math.floor((today.getTime() - new Date(sop.next_review_date).getTime()) / (1000 * 60 * 60 * 24));
                    try {
                        await this.notificationService.create({
                            userId: sop.owner_id,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.HIGH,
                            title: `SOP Review Overdue`,
                            message: `Standard Operating Procedure "${sop.title}" review is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue. Please complete the review immediately.`,
                            entityType: 'sop',
                            entityId: sop.id,
                            actionUrl: `/dashboard/governance/sops/${sop.id}`,
                            metadata: {
                                daysOverdue,
                                reviewDate: sop.next_review_date.toISOString(),
                            },
                        });
                        this.logger.log(`Sent overdue reminder for SOP ${sop.id} to user ${sop.owner_id}`);
                    }
                    catch (error) {
                        this.logger.error(`Failed to send overdue reminder for SOP ${sop.id}:`, error);
                    }
                }
            }
            this.logger.log('SOP review reminders check completed');
        }
        catch (error) {
            this.logger.error('Error checking SOP review reminders:', error);
        }
    }
    async checkAssessmentReminders() {
        this.logger.log('Checking for control assessment reminders...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const reminderDays = [30, 14, 7, 1];
            for (const daysAhead of reminderDays) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + daysAhead);
                const assessments = await this.assessmentRepository
                    .createQueryBuilder('assessment')
                    .where('assessment.end_date = :targetDate', { targetDate })
                    .andWhere('assessment.status IN (:...statuses)', {
                    statuses: [assessment_entity_1.AssessmentStatus.NOT_STARTED, assessment_entity_1.AssessmentStatus.IN_PROGRESS, assessment_entity_1.AssessmentStatus.UNDER_REVIEW],
                })
                    .leftJoinAndSelect('assessment.lead_assessor', 'assessor')
                    .getMany();
                for (const assessment of assessments) {
                    if (assessment.lead_assessor_id) {
                        try {
                            await this.notificationService.create({
                                userId: assessment.lead_assessor_id,
                                type: notification_entity_1.NotificationType.GENERAL,
                                priority: daysAhead <= 7 ? notification_entity_1.NotificationPriority.HIGH : notification_entity_1.NotificationPriority.MEDIUM,
                                title: `Assessment Deadline Approaching: ${daysAhead} Days`,
                                message: `Control assessment "${assessment.name}" is due on ${assessment.end_date.toLocaleDateString()}. Please ensure all results are recorded.`,
                                entityType: 'assessment',
                                entityId: assessment.id,
                                actionUrl: `/dashboard/governance/assessments/${assessment.id}`,
                                metadata: {
                                    daysUntilDue: daysAhead,
                                    dueDate: assessment.end_date.toISOString(),
                                },
                            });
                            this.logger.log(`Sent ${daysAhead}-day reminder for assessment ${assessment.id} to user ${assessment.lead_assessor_id}`);
                        }
                        catch (error) {
                            this.logger.error(`Failed to send reminder for assessment ${assessment.id}:`, error);
                        }
                    }
                }
            }
            const overdueAssessments = await this.assessmentRepository
                .createQueryBuilder('assessment')
                .where('assessment.end_date <= :today', { today })
                .andWhere('assessment.status IN (:...statuses)', {
                statuses: [assessment_entity_1.AssessmentStatus.NOT_STARTED, assessment_entity_1.AssessmentStatus.IN_PROGRESS, assessment_entity_1.AssessmentStatus.UNDER_REVIEW],
            })
                .leftJoinAndSelect('assessment.lead_assessor', 'assessor')
                .getMany();
            for (const assessment of overdueAssessments) {
                if (assessment.lead_assessor_id) {
                    const daysOverdue = Math.floor((today.getTime() - new Date(assessment.end_date).getTime()) / (1000 * 60 * 60 * 24));
                    try {
                        await this.notificationService.create({
                            userId: assessment.lead_assessor_id,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.HIGH,
                            title: `Assessment OVERDUE`,
                            message: `Control assessment "${assessment.name}" is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue. Please complete it immediately.`,
                            entityType: 'assessment',
                            entityId: assessment.id,
                            actionUrl: `/dashboard/governance/assessments/${assessment.id}`,
                            metadata: {
                                daysOverdue,
                                dueDate: assessment.end_date.toISOString(),
                            },
                        });
                        this.logger.log(`Sent overdue reminder for assessment ${assessment.id} to user ${assessment.lead_assessor_id}`);
                    }
                    catch (error) {
                        this.logger.error(`Failed to send overdue reminder for assessment ${assessment.id}:`, error);
                    }
                }
            }
            this.logger.log('Assessment reminders check completed');
        }
        catch (error) {
            this.logger.error('Error checking assessment reminders:', error);
        }
    }
    async sendScheduledDashboardEmails() {
        try {
            this.logger.debug('Checking for scheduled dashboard emails...');
            await this.dashboardEmailService.sendScheduledEmails();
            this.logger.debug('Scheduled dashboard emails check completed');
        }
        catch (error) {
            this.logger.error('Error sending scheduled dashboard emails:', error);
        }
    }
};
exports.GovernanceScheduleService = GovernanceScheduleService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceScheduleService.prototype, "captureGovernanceSnapshot", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceScheduleService.prototype, "checkPolicyReviewReminders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceScheduleService.prototype, "checkInfluencerReviewReminders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceScheduleService.prototype, "checkSOPReviewReminders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceScheduleService.prototype, "checkAssessmentReminders", null);
__decorate([
    (0, schedule_1.Cron)('0 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceScheduleService.prototype, "sendScheduledDashboardEmails", null);
exports.GovernanceScheduleService = GovernanceScheduleService = GovernanceScheduleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(2, (0, typeorm_1.InjectRepository)(influencer_entity_1.Influencer)),
    __param(3, (0, typeorm_1.InjectRepository)(sop_entity_1.SOP)),
    __param(4, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __metadata("design:paramtypes", [governance_trend_service_1.GovernanceTrendService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService,
        dashboard_email_service_1.DashboardEmailService])
], GovernanceScheduleService);
//# sourceMappingURL=governance-schedule.service.js.map