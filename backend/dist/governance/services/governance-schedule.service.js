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
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let GovernanceScheduleService = GovernanceScheduleService_1 = class GovernanceScheduleService {
    constructor(trendService, policyRepository, notificationService) {
        this.trendService = trendService;
        this.policyRepository = policyRepository;
        this.notificationService = notificationService;
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
            const reminderDays = [90, 60, 30];
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
exports.GovernanceScheduleService = GovernanceScheduleService = GovernanceScheduleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __metadata("design:paramtypes", [governance_trend_service_1.GovernanceTrendService,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], GovernanceScheduleService);
//# sourceMappingURL=governance-schedule.service.js.map