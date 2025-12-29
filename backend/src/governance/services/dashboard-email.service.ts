import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardEmailSchedule, EmailFrequency, EmailDayOfWeek } from '../entities/dashboard-email-schedule.entity';
import { GovernanceDashboardService } from './governance-dashboard.service';
import { User } from '../../users/entities/user.entity';
import { MailService } from '../../common/mail/mail.service';
import { TenantContextService } from '../../common/context/tenant-context.service';

export interface CreateDashboardEmailScheduleDto {
  name: string;
  description?: string;
  frequency: EmailFrequency;
  dayOfWeek?: EmailDayOfWeek;
  dayOfMonth?: number;
  sendTime: string;
  recipientEmails: string[];
  isActive?: boolean;
}

export interface UpdateDashboardEmailScheduleDto {
  name?: string;
  description?: string;
  frequency?: EmailFrequency;
  dayOfWeek?: EmailDayOfWeek;
  dayOfMonth?: number;
  sendTime?: string;
  recipientEmails?: string[];
  isActive?: boolean;
}

@Injectable()
export class DashboardEmailService {
  private readonly logger = new Logger(DashboardEmailService.name);

  constructor(
    @InjectRepository(DashboardEmailSchedule)
    private emailScheduleRepository: Repository<DashboardEmailSchedule>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dashboardService: GovernanceDashboardService,
    private mailService: MailService,
    private tenantContextService: TenantContextService,
  ) { }

  async createSchedule(dto: CreateDashboardEmailScheduleDto, userId: string): Promise<DashboardEmailSchedule> {
    // Validate the schedule configuration
    this.validateScheduleConfig(dto);

    const schedule = this.emailScheduleRepository.create({
      ...dto,
      createdById: userId,
      isActive: dto.isActive ?? true,
    });

    return this.emailScheduleRepository.save(schedule);
  }

  async updateSchedule(id: string, dto: UpdateDashboardEmailScheduleDto, userId: string): Promise<DashboardEmailSchedule> {
    const schedule = await this.emailScheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new Error('Dashboard email schedule not found');
    }

    // Validate the schedule configuration if any scheduling fields are being updated
    if (dto.frequency || dto.dayOfWeek || dto.dayOfMonth || dto.sendTime) {
      const updatedDto = { ...schedule, ...dto };
      this.validateScheduleConfig(updatedDto as CreateDashboardEmailScheduleDto);
    }

    Object.assign(schedule, dto, { updatedById: userId });
    return this.emailScheduleRepository.save(schedule);
  }

  async deleteSchedule(id: string): Promise<void> {
    const result = await this.emailScheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Dashboard email schedule not found');
    }
  }

  async getAllSchedules(): Promise<DashboardEmailSchedule[]> {
    return this.emailScheduleRepository.find({
      relations: ['createdBy', 'updatedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getScheduleById(id: string): Promise<DashboardEmailSchedule> {
    const schedule = await this.emailScheduleRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    if (!schedule) {
      throw new Error('Dashboard email schedule not found');
    }

    return schedule;
  }

  async toggleScheduleStatus(id: string, userId: string): Promise<DashboardEmailSchedule> {
    const schedule = await this.emailScheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new Error('Dashboard email schedule not found');
    }

    schedule.isActive = !schedule.isActive;
    schedule.updatedById = userId;
    return this.emailScheduleRepository.save(schedule);
  }

  async sendScheduledEmails(): Promise<void> {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as EmailDayOfWeek;
    const currentDayOfMonth = now.getDate();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    // Find all active schedules that should be sent now
    const schedules = await this.emailScheduleRepository.find({
      where: { isActive: true },
    });

    for (const schedule of schedules) {
      let shouldSend = false;

      switch (schedule.frequency) {
        case EmailFrequency.DAILY:
          shouldSend = schedule.sendTime === currentTime;
          break;

        case EmailFrequency.WEEKLY:
          shouldSend = schedule.dayOfWeek === currentDay && schedule.sendTime === currentTime;
          break;

        case EmailFrequency.MONTHLY:
          shouldSend = schedule.dayOfMonth === currentDayOfMonth && schedule.sendTime === currentTime;
          break;
      }

      if (shouldSend) {
        try {
          await this.sendDashboardEmail(schedule);
          schedule.lastSentAt = now;
          await this.emailScheduleRepository.save(schedule);
          this.logger.log(`Sent dashboard email for schedule: ${schedule.name}`);
        } catch (error) {
          this.logger.error(`Failed to send dashboard email for schedule ${schedule.id}:`, error);
        }
      }
    }
  }

  private async sendDashboardEmail(schedule: DashboardEmailSchedule): Promise<void> {
    // Run dashboard generation and email sending in the tenant's context
    await this.tenantContextService.run({ tenantId: schedule.tenantId }, async () => {
      try {
        // Get dashboard data for the specific tenant
        const dashboardData = await this.dashboardService.getDashboard();

        // Generate email content
        const emailContent = this.generateEmailContent(dashboardData, schedule);

        // Send actual email using MailService
        await this.mailService.send({
          to: schedule.recipientEmails,
          subject: `${schedule.name} - Governance Dashboard Report`,
          html: emailContent,
        }, schedule.tenantId);

        this.logger.log(`Sent dashboard email to: ${schedule.recipientEmails.join(', ')}`);
      } catch (error) {
        this.logger.error(`Failed to send dashboard email for schedule ${schedule.id}:`, error.message);
        throw error;
      }
    });
  }

  private generateEmailContent(dashboardData: any, schedule: DashboardEmailSchedule): string {
    const { summary, controlStats, policyStats, assessmentStats, findingStats } = dashboardData;

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .metric { background-color: #e9ecef; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .alert { color: #dc3545; font-weight: bold; }
            .success { color: #28a745; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${schedule.name}</h1>
            <p>Governance Dashboard Report - ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="metric-grid">
            <div class="metric">
              <h3>Total Policies</h3>
              <p class="success">${summary.totalPolicies}</p>
            </div>
            <div class="metric">
              <h3>Active Influencers</h3>
              <p class="success">${summary.activeInfluencers}</p>
            </div>
            <div class="metric">
              <h3>Implemented Controls</h3>
              <p class="success">${summary.implementedControls} / ${summary.totalControls}</p>
            </div>
            <div class="metric">
              <h3>Open Findings</h3>
              <p class="${summary.openFindings > 0 ? 'alert' : 'success'}">${summary.openFindings}</p>
            </div>
          </div>

          <div class="metric">
            <h3>Control Implementation Rate</h3>
            <p>${summary.totalControls > 0 ? Math.round((summary.implementedControls / summary.totalControls) * 100) : 0}%</p>
          </div>

          <div class="metric">
            <h3>Assessment Completion Rate</h3>
            <p>${summary.totalAssessments > 0 ? Math.round((summary.completedAssessments / summary.totalAssessments) * 100) : 0}%</p>
          </div>

          <p>This is an automated report. Please visit the governance dashboard for detailed information.</p>
        </body>
      </html>
    `;
  }

  private validateScheduleConfig(dto: CreateDashboardEmailScheduleDto): void {
    // Validate send time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(dto.sendTime)) {
      throw new Error('Send time must be in HH:MM format');
    }

    // Validate frequency-specific requirements
    switch (dto.frequency) {
      case EmailFrequency.WEEKLY:
        if (!dto.dayOfWeek) {
          throw new Error('Day of week is required for weekly schedules');
        }
        break;

      case EmailFrequency.MONTHLY:
        if (!dto.dayOfMonth || dto.dayOfMonth < 1 || dto.dayOfMonth > 31) {
          throw new Error('Day of month must be between 1 and 31 for monthly schedules');
        }
        break;
    }

    // Validate recipient emails
    if (!dto.recipientEmails || dto.recipientEmails.length === 0) {
      throw new Error('At least one recipient email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of dto.recipientEmails) {
      if (!emailRegex.test(email)) {
        throw new Error(`Invalid email address: ${email}`);
      }
    }
  }
}