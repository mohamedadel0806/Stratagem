import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { ReportTemplate } from '../entities/report-template.entity';
import { ReportTemplateService } from '../services/report-template.service';

@Injectable()
export class ScheduledReportScheduler {
  private readonly logger = new Logger(ScheduledReportScheduler.name);

  constructor(
    @InjectRepository(ReportTemplate)
    private templateRepository: Repository<ReportTemplate>,
    private reportTemplateService: ReportTemplateService,
  ) {}

  /**
   * Check for scheduled reports every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleScheduledReports() {
    this.logger.log('Checking for scheduled reports...');

    try {
      const now = new Date();
      const templates = await this.templateRepository.find({
        where: {
          isScheduled: true,
          isActive: true,
          nextRunAt: LessThanOrEqual(now),
        },
      });

      for (const template of templates) {
        try {
          await this.reportTemplateService.sendScheduledReport(template.id);
        } catch (error) {
          this.logger.error(`Failed to send scheduled report ${template.name}:`, error);
        }
      }

      this.logger.log(`Processed ${templates.length} scheduled reports`);
    } catch (error) {
      this.logger.error('Error processing scheduled reports:', error);
    }
  }
}



