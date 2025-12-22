import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull, MoreThanOrEqual } from 'typeorm';
import { InformationAsset } from '../../asset/entities/information-asset.entity';
import { NotificationService } from '../services/notification.service';
import { NotificationPriority, NotificationType } from '../entities/notification.entity';

@Injectable()
export class InformationAssetClassificationScheduler {
  private readonly logger = new Logger(InformationAssetClassificationScheduler.name);

  constructor(
    @InjectRepository(InformationAsset)
    private readonly informationAssetRepository: Repository<InformationAsset>,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Send reminders for information assets that are approaching their reclassification date
   * Runs daily at 1 AM and sends notifications for assets with reclassification dates
   * within the next 30 days that haven't received a reminder yet.
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleReclassificationReminders() {
    this.logger.log('Starting scheduled information asset reclassification reminders...');

    try {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const thirtyDaysFromNow = new Date(startOfToday);
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const assets = await this.informationAssetRepository.find({
        where: {
          deletedAt: IsNull(),
          reclassificationDate: Between(startOfToday, thirtyDaysFromNow),
          reclassificationReminderSent: false,
        },
        relations: ['informationOwner', 'businessUnit'],
      });

      this.logger.log(
        `Found ${assets.length} information assets due for reclassification within 30 days`,
      );

      for (const asset of assets) {
        const ownerId = asset.informationOwnerId;
        if (!ownerId) {
          this.logger.warn(
            `Information asset ${asset.id} has upcoming reclassification but no information owner assigned`,
          );
          continue;
        }

        const daysRemaining = Math.ceil(
          (asset.reclassificationDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
        );

        const assetName = asset.name || asset.uniqueIdentifier;
        const buName = asset.businessUnit?.name;

        await this.notificationService.create({
          userId: ownerId,
          type: NotificationType.DEADLINE_APPROACHING,
          priority: daysRemaining <= 7 ? NotificationPriority.URGENT : NotificationPriority.HIGH,
          title: 'Information Asset Reclassification Due Soon',
          message: `"${assetName}"${buName ? ` in ${buName}` : ''} is due for reclassification on ${asset.reclassificationDate.toISOString().split('T')[0]} (${daysRemaining} day(s) remaining).`,
          entityType: 'information-asset',
          entityId: asset.id,
          actionUrl: `/dashboard/assets/information/${asset.id}`,
          metadata: {
            reclassificationDate: asset.reclassificationDate,
            daysRemaining,
          },
        });

        // Mark reminder as sent to avoid duplicate notifications
        asset.reclassificationReminderSent = true;
        await this.informationAssetRepository.save(asset);
      }

      this.logger.log('Information asset reclassification reminders completed successfully');
    } catch (error) {
      this.logger.error('Error during information asset reclassification reminders:', error);
    }
  }
}




