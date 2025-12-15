import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GovernanceTrendService } from './governance-trend.service';

@Injectable()
export class GovernanceScheduleService {
  private readonly logger = new Logger(GovernanceScheduleService.name);

  constructor(private readonly trendService: GovernanceTrendService) {}

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
}
