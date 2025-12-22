import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceTrendService } from './governance-trend.service';
import { Policy } from '../policies/entities/policy.entity';
import { PolicyStatus } from '../policies/entities/policy.entity';
import { Influencer } from '../influencers/entities/influencer.entity';
import { InfluencerStatus } from '../influencers/entities/influencer.entity';
import { SOP, SOPStatus } from '../sops/entities/sop.entity';
import { Assessment, AssessmentStatus } from '../assessments/entities/assessment.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';
import { DashboardEmailService } from './dashboard-email.service';

@Injectable()
export class GovernanceScheduleService {
  private readonly logger = new Logger(GovernanceScheduleService.name);

  constructor(
    private readonly trendService: GovernanceTrendService,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(Influencer)
    private influencerRepository: Repository<Influencer>,
    @InjectRepository(SOP)
    private sopRepository: Repository<SOP>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    private notificationService: NotificationService,
    private dashboardEmailService: DashboardEmailService,
  ) {}

  /**
   * Runs daily at midnight UTC to capture a snapshot of current governance metrics.
   * This ensures the trend history grows automatically without manual intervention.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async captureGovernanceSnapshot() {
    try {
      this.logger.debug('Starting daily governance snapshot capture...');
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      
      await this.trendService.ensureSnapshotForDate(today);
      
      this.logger.log(`✅ Daily snapshot captured for ${today.toISOString().split('T')[0]}`);
    } catch (error) {
      this.logger.error('Failed to capture daily governance snapshot', error.stack);
    }
  }

  /**
   * Check for policies due for review and send reminders
   * Runs daily at 8 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkPolicyReviewReminders() {
    this.logger.log('Checking for policy review reminders...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check for policies due in 90, 60, 30, 7, and 1 days
      const reminderDays = [90, 60, 30, 7, 1];
      
      for (const daysAhead of reminderDays) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysAhead);

        const policies = await this.policyRepository
          .createQueryBuilder('policy')
          .where('policy.next_review_date = :targetDate', { targetDate })
          .andWhere('policy.status IN (:...statuses)', {
            statuses: [PolicyStatus.APPROVED, PolicyStatus.PUBLISHED],
          })
          .leftJoinAndSelect('policy.owner', 'owner')
          .getMany();

        for (const policy of policies) {
          if (policy.owner_id) {
            try {
              await this.notificationService.create({
                userId: policy.owner_id,
                type: NotificationType.POLICY_REVIEW_REQUIRED,
                priority: daysAhead <= 30 ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
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
            } catch (error) {
              this.logger.error(`Failed to send reminder for policy ${policy.id}:`, error);
            }
          }
        }
      }

      // Check for overdue reviews
      const overduePolicies = await this.policyRepository
        .createQueryBuilder('policy')
        .where('policy.next_review_date <= :today', { today })
        .andWhere('policy.status IN (:...statuses)', {
          statuses: [PolicyStatus.APPROVED, PolicyStatus.PUBLISHED],
        })
        .leftJoinAndSelect('policy.owner', 'owner')
        .getMany();

      for (const policy of overduePolicies) {
        if (policy.owner_id) {
          const daysOverdue = Math.floor((today.getTime() - new Date(policy.next_review_date).getTime()) / (1000 * 60 * 60 * 24));
          
          try {
            await this.notificationService.create({
              userId: policy.owner_id,
              type: NotificationType.POLICY_REVIEW_REQUIRED,
              priority: NotificationPriority.HIGH,
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
          } catch (error) {
            this.logger.error(`Failed to send overdue reminder for policy ${policy.id}:`, error);
          }
        }
      }

      this.logger.log('Policy review reminders check completed');
    } catch (error) {
      this.logger.error('Error checking policy review reminders:', error);
    }
  }

  /**
   * Check for influencers due for review and send reminders
   * Runs daily at 8 AM (after policy reminders)
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkInfluencerReviewReminders() {
    this.logger.log('Checking for influencer review reminders...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check for influencers due in 90, 60, 30, 7, and 1 days
      const reminderDays = [90, 60, 30, 7, 1];
      
      for (const daysAhead of reminderDays) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysAhead);

        const influencers = await this.influencerRepository
          .createQueryBuilder('influencer')
          .where('influencer.next_review_date = :targetDate', { targetDate })
          .andWhere('influencer.status IN (:...statuses)', {
            statuses: [InfluencerStatus.ACTIVE],
          })
          .leftJoinAndSelect('influencer.owner', 'owner')
          .getMany();

        for (const influencer of influencers) {
          if (influencer.owner_id) {
            try {
              await this.notificationService.create({
                userId: influencer.owner_id,
                type: NotificationType.GENERAL,
                priority: daysAhead <= 30 ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
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
            } catch (error) {
              this.logger.error(`Failed to send reminder for influencer ${influencer.id}:`, error);
            }
          }
        }
      }

      // Check for overdue reviews
      const overdueInfluencers = await this.influencerRepository
        .createQueryBuilder('influencer')
        .where('influencer.next_review_date <= :today', { today })
        .andWhere('influencer.status IN (:...statuses)', {
          statuses: [InfluencerStatus.ACTIVE],
        })
        .leftJoinAndSelect('influencer.owner', 'owner')
        .getMany();

      for (const influencer of overdueInfluencers) {
        if (influencer.owner_id) {
          const daysOverdue = Math.floor((today.getTime() - new Date(influencer.next_review_date).getTime()) / (1000 * 60 * 60 * 24));
          
          try {
            await this.notificationService.create({
              userId: influencer.owner_id,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.HIGH,
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
          } catch (error) {
            this.logger.error(`Failed to send overdue reminder for influencer ${influencer.id}:`, error);
          }
        }
      }

      this.logger.log('Influencer review reminders check completed');
    } catch (error) {
      this.logger.error('Error checking influencer review reminders:', error);
    }
  }

  /**
   * Check for SOPs due for review and send reminders
   * Runs daily at 8 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkSOPReviewReminders() {
    this.logger.log('Checking for SOP review reminders...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check for SOPs due in 90, 60, 30, 7, and 1 days
      const reminderDays = [90, 60, 30, 7, 1];
      
      for (const daysAhead of reminderDays) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysAhead);

        const sops = await this.sopRepository
          .createQueryBuilder('sop')
          .where('sop.next_review_date = :targetDate', { targetDate })
          .andWhere('sop.status IN (:...statuses)', {
            statuses: [SOPStatus.APPROVED, SOPStatus.PUBLISHED],
          })
          .leftJoinAndSelect('sop.owner', 'owner')
          .getMany();

        for (const sop of sops) {
          if (sop.owner_id) {
            try {
              await this.notificationService.create({
                userId: sop.owner_id,
                type: NotificationType.GENERAL,
                priority: daysAhead <= 7 ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
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
            } catch (error) {
              this.logger.error(`Failed to send reminder for SOP ${sop.id}:`, error);
            }
          }
        }
      }

      // Check for overdue reviews
      const overdueSOPs = await this.sopRepository
        .createQueryBuilder('sop')
        .where('sop.next_review_date <= :today', { today })
        .andWhere('sop.status IN (:...statuses)', {
          statuses: [SOPStatus.APPROVED, SOPStatus.PUBLISHED],
        })
        .leftJoinAndSelect('sop.owner', 'owner')
        .getMany();

      for (const sop of overdueSOPs) {
        if (sop.owner_id) {
          const daysOverdue = Math.floor((today.getTime() - new Date(sop.next_review_date).getTime()) / (1000 * 60 * 60 * 24));
          
          try {
            await this.notificationService.create({
              userId: sop.owner_id,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.HIGH,
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
          } catch (error) {
            this.logger.error(`Failed to send overdue reminder for SOP ${sop.id}:`, error);
          }
        }
      }

      this.logger.log('SOP review reminders check completed');
    } catch (error) {
      this.logger.error('Error checking SOP review reminders:', error);
    }
  }

  /**
   * Check for Assessments due and send reminders
   * Runs daily at 8 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkAssessmentReminders() {
    this.logger.log('Checking for control assessment reminders...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check for assessments due in 30, 14, 7, and 1 days
      const reminderDays = [30, 14, 7, 1];
      
      for (const daysAhead of reminderDays) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysAhead);

        const assessments = await this.assessmentRepository
          .createQueryBuilder('assessment')
          .where('assessment.end_date = :targetDate', { targetDate })
          .andWhere('assessment.status IN (:...statuses)', {
            statuses: [AssessmentStatus.NOT_STARTED, AssessmentStatus.IN_PROGRESS, AssessmentStatus.UNDER_REVIEW],
          })
          .leftJoinAndSelect('assessment.lead_assessor', 'assessor')
          .getMany();

        for (const assessment of assessments) {
          if (assessment.lead_assessor_id) {
            try {
              await this.notificationService.create({
                userId: assessment.lead_assessor_id,
                type: NotificationType.GENERAL,
                priority: daysAhead <= 7 ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
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
            } catch (error) {
              this.logger.error(`Failed to send reminder for assessment ${assessment.id}:`, error);
            }
          }
        }
      }

      // Check for overdue assessments
      const overdueAssessments = await this.assessmentRepository
        .createQueryBuilder('assessment')
        .where('assessment.end_date <= :today', { today })
        .andWhere('assessment.status IN (:...statuses)', {
          statuses: [AssessmentStatus.NOT_STARTED, AssessmentStatus.IN_PROGRESS, AssessmentStatus.UNDER_REVIEW],
        })
        .leftJoinAndSelect('assessment.lead_assessor', 'assessor')
        .getMany();

      for (const assessment of overdueAssessments) {
        if (assessment.lead_assessor_id) {
          const daysOverdue = Math.floor((today.getTime() - new Date(assessment.end_date).getTime()) / (1000 * 60 * 60 * 24));
          
          try {
            await this.notificationService.create({
              userId: assessment.lead_assessor_id,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.HIGH,
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
          } catch (error) {
            this.logger.error(`Failed to send overdue reminder for assessment ${assessment.id}:`, error);
          }
        }
      }

      this.logger.log('Assessment reminders check completed');
    } catch (error) {
      this.logger.error('Error checking assessment reminders:', error);
    }
  }

  /**
   * Send scheduled dashboard emails
   * Runs every minute to check for emails that need to be sent
   */
  @Cron('0 * * * * *') // Every minute
  async sendScheduledDashboardEmails() {
    try {
      this.logger.debug('Checking for scheduled dashboard emails...');
      await this.dashboardEmailService.sendScheduledEmails();
      this.logger.debug('Scheduled dashboard emails check completed');
    } catch (error) {
      this.logger.error('Error sending scheduled dashboard emails:', error);
    }
  }
}
