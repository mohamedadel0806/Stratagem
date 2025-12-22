import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityTestResult } from '../entities/security-test-result.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationPriority, NotificationType } from '../../common/entities/notification.entity';

@Injectable()
export class SecurityTestAlertScheduler {
  private readonly logger = new Logger(SecurityTestAlertScheduler.name);

  constructor(
    @InjectRepository(SecurityTestResult)
    private testResultRepository: Repository<SecurityTestResult>,
    @InjectRepository(BusinessApplication)
    private applicationRepository: Repository<BusinessApplication>,
    @InjectRepository(SoftwareAsset)
    private softwareRepository: Repository<SoftwareAsset>,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleFailedSecurityTestAlerts() {
    this.logger.log('Checking for failed security tests...');

    try {
      // Find failed tests from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const failedTests = await this.testResultRepository
        .createQueryBuilder('test')
        .where('test.testDate >= :thirtyDaysAgo', { thirtyDaysAgo })
        .andWhere('(test.passed = false OR test.severity IN (:...severities))', {
          severities: ['critical', 'high'],
        })
        .getMany();

      for (const test of failedTests) {
        try {
          // Get asset owner
          let ownerId: string | undefined;
          let assetName: string;

          if (test.assetType === 'application') {
            const app = await this.applicationRepository.findOne({
              where: { id: test.assetId },
              relations: ['owner'],
            });
            if (app) {
              ownerId = app.ownerId;
              assetName = app.applicationName;
            }
          } else {
            const software = await this.softwareRepository.findOne({
              where: { id: test.assetId },
              relations: ['owner'],
            });
            if (software) {
              ownerId = software.ownerId;
              assetName = software.softwareName;
            }
          }

          if (ownerId) {
            await this.notificationService.create({
              userId: ownerId,
              type: NotificationType.GENERAL,
              priority: test.severity === 'critical' ? NotificationPriority.URGENT : NotificationPriority.HIGH,
              title: 'Security Test Failed',
              message: `Security test for ${test.assetType} "${assetName}" failed with ${test.severity} severity. Test date: ${test.testDate.toLocaleDateString()}. Findings: ${test.findingsCritical} critical, ${test.findingsHigh} high.`,
              metadata: {
                assetType: test.assetType,
                assetId: test.assetId,
                testResultId: test.id,
              },
            });
          }
        } catch (error) {
          this.logger.error(`Error sending alert for test ${test.id}: ${error.message}`);
        }
      }

      this.logger.log(`Processed ${failedTests.length} failed security tests`);
    } catch (error) {
      this.logger.error(`Error in handleFailedSecurityTestAlerts: ${error.message}`, error.stack);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleOverdueSecurityTestAlerts() {
    this.logger.log('Checking for overdue security tests...');

    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const overdueTests = await this.testResultRepository
        .createQueryBuilder('test')
        .where('test.testDate < :oneYearAgo', { oneYearAgo })
        .andWhere('test.retestRequired = :retestRequired', { retestRequired: true })
        .andWhere('(test.retestDate IS NULL OR test.retestDate < :now)', { now: new Date() })
        .getMany();

      for (const test of overdueTests) {
        try {
          let ownerId: string | undefined;
          let assetName: string;

          if (test.assetType === 'application') {
            const app = await this.applicationRepository.findOne({
              where: { id: test.assetId },
              relations: ['owner'],
            });
            if (app) {
              ownerId = app.ownerId;
              assetName = app.applicationName;
            }
          } else {
            const software = await this.softwareRepository.findOne({
              where: { id: test.assetId },
              relations: ['owner'],
            });
            if (software) {
              ownerId = software.ownerId;
              assetName = software.softwareName;
            }
          }

          if (ownerId) {
            await this.notificationService.create({
              userId: ownerId,
              type: NotificationType.DEADLINE_APPROACHING,
              priority: NotificationPriority.HIGH,
              title: 'Security Test Overdue',
              message: `Security test for ${test.assetType} "${assetName}" is overdue. Last test: ${test.testDate.toLocaleDateString()}. Retest required.`,
              metadata: {
                assetType: test.assetType,
                assetId: test.assetId,
                testResultId: test.id,
              },
            });
          }
        } catch (error) {
          this.logger.error(`Error sending overdue alert for test ${test.id}: ${error.message}`);
        }
      }

      this.logger.log(`Processed ${overdueTests.length} overdue security tests`);
    } catch (error) {
      this.logger.error(`Error in handleOverdueSecurityTestAlerts: ${error.message}`, error.stack);
    }
  }
}



