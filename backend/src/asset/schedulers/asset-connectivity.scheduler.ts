import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { PhysicalAsset, NetworkApprovalStatus, ConnectivityStatus } from '../entities/physical-asset.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationPriority, NotificationType } from '../../common/entities/notification.entity';

@Injectable()
export class AssetConnectivityScheduler {
  private readonly logger = new Logger(AssetConnectivityScheduler.name);

  constructor(
    @InjectRepository(PhysicalAsset)
    private readonly physicalAssetRepository: Repository<PhysicalAsset>,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Daily job to detect connected assets that do NOT have network approval
   * and generate high-priority notifications for their owners (or admins).
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async notifyUnapprovedConnectedAssets(): Promise<void> {
    try {
      const unapproved = await this.physicalAssetRepository.find({
        where: {
          deletedAt: IsNull(),
          connectivityStatus: ConnectivityStatus.CONNECTED,
        },
        relations: ['owner'],
      });

      const suspects = unapproved.filter(
        (a) => a.networkApprovalStatus && a.networkApprovalStatus !== NetworkApprovalStatus.APPROVED,
      );

      if (!suspects.length) {
        return;
      }

      for (const asset of suspects) {
        const ownerId = (asset.owner && asset.owner.id) || null;

        const title = 'Connected asset without network approval';
        const message = `Physical asset "${asset.assetDescription || asset.uniqueIdentifier}" is connected but has network approval status "${asset.networkApprovalStatus}".`;

        if (ownerId) {
          await this.notificationService.create({
            userId: ownerId,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.HIGH,
            title,
            message,
            entityType: 'physical_asset',
            entityId: asset.id,
            actionUrl: `/dashboard/assets/physical/${asset.id}`,
            metadata: {
              connectivityStatus: asset.connectivityStatus,
              networkApprovalStatus: asset.networkApprovalStatus,
            },
          });
        } else {
          this.logger.warn(
            `Connected unapproved asset ${asset.id} has no owner; skipping owner-specific notification.`,
          );
        }
      }
    } catch (error: any) {
      this.logger.error(
        `Failed to run notifyUnapprovedConnectedAssets: ${error?.message || 'Unknown error'}`,
        error?.stack,
      );
    }
  }
}




