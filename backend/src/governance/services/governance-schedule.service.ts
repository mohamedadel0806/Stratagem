import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceTrendService } from './governance-trend.service';
import { Policy } from '../policies/entities/policy.entity';
import { PolicyStatus } from '../policies/entities/policy.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';

@Injectable()
export class GovernanceScheduleService {
  private readonly logger = new Logger(GovernanceScheduleService.name);

  constructor(
    private readonly trendService: GovernanceTrendService,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    private notificationService: NotificationService,
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

      // Check for policies due in 90, 60, and 30 days
      const reminderDays = [90, 60, 30];
      
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
}
