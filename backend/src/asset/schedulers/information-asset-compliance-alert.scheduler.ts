import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { InformationAsset } from '../entities/information-asset.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationPriority, NotificationType } from '../../common/entities/notification.entity';

@Injectable()
export class InformationAssetComplianceAlertScheduler {
  private readonly logger = new Logger(InformationAssetComplianceAlertScheduler.name);

  constructor(
    @InjectRepository(InformationAsset)
    private readonly informationAssetRepository: Repository<InformationAsset>,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async handleMissingComplianceAlerts() {
    this.logger.log('Checking for information assets missing compliance information...');

    try {
      const assets = await this.informationAssetRepository
        .createQueryBuilder('asset')
        .leftJoin('asset.informationOwner', 'owner')
        .select([
          'asset.id',
          'asset.name',
          'asset.complianceRequirements',
          'asset.informationOwnerId',
          'owner.id',
          'owner.email',
        ])
        .where('asset.deletedAt IS NULL')
        .andWhere(
          '(asset.complianceRequirements IS NULL OR asset.complianceRequirements::jsonb = \'[]\'::jsonb OR jsonb_array_length(asset.complianceRequirements::jsonb) = 0)',
        )
        .getMany();

      this.logger.log(`Found ${assets.length} information assets missing compliance information`);

      for (const asset of assets) {
        const ownerId = asset.informationOwnerId;
        if (!ownerId) {
          this.logger.warn(`Asset ${asset.id} (${asset.name}) has no information owner, skipping alert`);
          continue;
        }

        try {
          await this.notificationService.create({
            userId: ownerId,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'Missing Compliance Information',
            message: `Information asset "${asset.name}" is missing compliance requirements. Please update the asset with appropriate compliance frameworks.`,
            metadata: {
              assetType: 'information',
              assetId: asset.id,
            },
          });

          this.logger.log(`Sent compliance alert for asset ${asset.id} to owner ${ownerId}`);
        } catch (error) {
          this.logger.error(`Error sending compliance alert for asset ${asset.id}: ${error.message}`);
        }
      }

      this.logger.log(`Processed ${assets.length} information assets missing compliance information`);
    } catch (error) {
      this.logger.error(`Error in handleMissingComplianceAlerts: ${error.message}`, error.stack);
    }
  }
}

