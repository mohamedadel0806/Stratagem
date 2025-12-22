import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationPriority, NotificationType } from '../../common/entities/notification.entity';

@Injectable()
export class SupplierContractAlertScheduler {
  private readonly logger = new Logger(SupplierContractAlertScheduler.name);

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async handleContractExpirationAlerts() {
    this.logger.log('Checking for suppliers with contracts expiring soon...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check for contracts expiring in 90, 60, and 30 days
      const alertDays = [90, 60, 30];

      for (const days of alertDays) {
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + days);

        const suppliers = await this.supplierRepository
          .createQueryBuilder('supplier')
          .leftJoin('supplier.owner', 'owner')
          .select([
            'supplier.id',
            'supplier.supplierName',
            'supplier.contractReference',
            'supplier.contractEndDate',
            'supplier.autoRenewal',
            'supplier.ownerId',
            'owner.id',
            'owner.email',
          ])
          .where('supplier.deletedAt IS NULL')
          .andWhere('supplier.contractEndDate IS NOT NULL')
          .andWhere('supplier.contractEndDate = :targetDate', { targetDate })
          .andWhere('supplier.autoRenewal = :autoRenewal', { autoRenewal: false })
          .getMany();

        this.logger.log(`Found ${suppliers.length} suppliers with contracts expiring in ${days} days`);

        for (const supplier of suppliers) {
          const ownerId = supplier.ownerId;
          if (!ownerId) {
            this.logger.warn(`Supplier ${supplier.id} (${supplier.supplierName}) has no owner, skipping alert`);
            continue;
          }

          try {
            const priority = days <= 30 ? NotificationPriority.HIGH : days <= 60 ? NotificationPriority.MEDIUM : NotificationPriority.LOW;
            const message = days <= 30
              ? `Contract for supplier "${supplier.supplierName}" expires in ${days} days. Immediate action required.`
              : `Contract for supplier "${supplier.supplierName}" expires in ${days} days. Please review renewal options.`;

            await this.notificationService.create({
              userId: ownerId,
              type: NotificationType.DEADLINE_APPROACHING,
              priority,
              title: `Contract Expiring in ${days} Days`,
              message,
              metadata: {
                assetType: 'supplier',
                assetId: supplier.id,
                contractReference: supplier.contractReference,
                contractEndDate: supplier.contractEndDate?.toISOString(),
                daysUntilExpiration: days,
              },
            });

            this.logger.log(`Sent ${days}-day contract expiration alert for supplier ${supplier.id} to owner ${ownerId}`);
          } catch (error) {
            this.logger.error(`Error sending contract expiration alert for supplier ${supplier.id}: ${error.message}`);
          }
        }
      }

      // Also check for expired contracts
      const expiredSuppliers = await this.supplierRepository
        .createQueryBuilder('supplier')
        .leftJoin('supplier.owner', 'owner')
        .select([
          'supplier.id',
          'supplier.supplierName',
          'supplier.contractReference',
          'supplier.contractEndDate',
          'supplier.ownerId',
          'owner.id',
          'owner.email',
        ])
        .where('supplier.deletedAt IS NULL')
        .andWhere('supplier.contractEndDate IS NOT NULL')
        .andWhere('supplier.contractEndDate < :today', { today })
        .getMany();

      this.logger.log(`Found ${expiredSuppliers.length} suppliers with expired contracts`);

      for (const supplier of expiredSuppliers) {
        const ownerId = supplier.ownerId;
        if (!ownerId) {
          continue;
        }

        try {
          await this.notificationService.create({
            userId: ownerId,
            type: NotificationType.DEADLINE_APPROACHING,
            priority: NotificationPriority.HIGH,
            title: 'Contract Expired',
            message: `Contract for supplier "${supplier.supplierName}" has expired. Please renew or terminate the relationship.`,
            metadata: {
              assetType: 'supplier',
              assetId: supplier.id,
              contractReference: supplier.contractReference,
              contractEndDate: supplier.contractEndDate?.toISOString(),
            },
          });

          this.logger.log(`Sent expired contract alert for supplier ${supplier.id} to owner ${ownerId}`);
        } catch (error) {
          this.logger.error(`Error sending expired contract alert for supplier ${supplier.id}: ${error.message}`);
        }
      }

      this.logger.log('Completed contract expiration alert processing');
    } catch (error) {
      this.logger.error(`Error in handleContractExpirationAlerts: ${error.message}`, error.stack);
    }
  }
}



