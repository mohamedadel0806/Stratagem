import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, IsNull } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { CriticalityLevel } from '../entities/physical-asset.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationPriority, NotificationType } from '../../common/entities/notification.entity';

@Injectable()
export class SupplierAssessmentAlertScheduler {
  private readonly logger = new Logger(SupplierAssessmentAlertScheduler.name);

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleCriticalSuppliersWithoutAssessment() {
    this.logger.log('Checking for critical suppliers without recent assessments...');

    try {
      // Get date 1 year ago
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      oneYearAgo.setHours(0, 0, 0, 0);

      // Find critical or high criticality suppliers without recent risk assessment
      const criticalSuppliers = await this.supplierRepository
        .createQueryBuilder('supplier')
        .leftJoin('supplier.owner', 'owner')
        .select([
          'supplier.id',
          'supplier.supplierName',
          'supplier.criticalityLevel',
          'supplier.riskAssessmentDate',
          'supplier.lastReviewDate',
          'supplier.ownerId',
          'owner.id',
          'owner.email',
        ])
        .where('supplier.deletedAt IS NULL')
        .andWhere('supplier.criticalityLevel IN (:...levels)', {
          levels: [CriticalityLevel.CRITICAL, CriticalityLevel.HIGH],
        })
        .andWhere(
          '(supplier.riskAssessmentDate IS NULL OR supplier.riskAssessmentDate < :oneYearAgo OR supplier.lastReviewDate IS NULL OR supplier.lastReviewDate < :oneYearAgo)',
          { oneYearAgo },
        )
        .getMany();

      this.logger.log(`Found ${criticalSuppliers.length} critical/high suppliers without recent assessments`);

      for (const supplier of criticalSuppliers) {
        const ownerId = supplier.ownerId;
        if (!ownerId) {
          this.logger.warn(`Supplier ${supplier.id} (${supplier.supplierName}) has no owner, skipping alert`);
          continue;
        }

        try {
          const priority = supplier.criticalityLevel === CriticalityLevel.CRITICAL
            ? NotificationPriority.HIGH
            : NotificationPriority.MEDIUM;

          const lastAssessment = supplier.riskAssessmentDate || supplier.lastReviewDate;
          const daysSince = lastAssessment
            ? Math.floor((new Date().getTime() - new Date(lastAssessment).getTime()) / (1000 * 60 * 60 * 24))
            : null;

          const message = lastAssessment
            ? `Critical supplier "${supplier.supplierName}" has not been assessed in ${daysSince} days. Please schedule a risk assessment.`
            : `Critical supplier "${supplier.supplierName}" has never been assessed. Please complete a risk assessment.`;

          await this.notificationService.create({
            userId: ownerId,
            type: NotificationType.DEADLINE_APPROACHING,
            priority,
            title: 'Critical Supplier Assessment Required',
            message,
            metadata: {
              assetType: 'supplier',
              assetId: supplier.id,
              criticalityLevel: supplier.criticalityLevel,
              lastAssessmentDate: lastAssessment?.toISOString(),
              daysSinceLastAssessment: daysSince,
            },
          });

          this.logger.log(`Sent assessment alert for supplier ${supplier.id} to owner ${ownerId}`);
        } catch (error) {
          this.logger.error(`Error sending assessment alert for supplier ${supplier.id}: ${error.message}`);
        }
      }

      this.logger.log(`Processed ${criticalSuppliers.length} critical suppliers without recent assessments`);
    } catch (error) {
      this.logger.error(`Error in handleCriticalSuppliersWithoutAssessment: ${error.message}`, error.stack);
    }
  }
}

