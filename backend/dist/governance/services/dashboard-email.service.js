"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DashboardEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardEmailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dashboard_email_schedule_entity_1 = require("../entities/dashboard-email-schedule.entity");
const governance_dashboard_service_1 = require("./governance-dashboard.service");
const user_entity_1 = require("../../users/entities/user.entity");
let DashboardEmailService = DashboardEmailService_1 = class DashboardEmailService {
    constructor(emailScheduleRepository, userRepository, dashboardService) {
        this.emailScheduleRepository = emailScheduleRepository;
        this.userRepository = userRepository;
        this.dashboardService = dashboardService;
        this.logger = new common_1.Logger(DashboardEmailService_1.name);
    }
    async createSchedule(dto, userId) {
        var _a;
        this.validateScheduleConfig(dto);
        const schedule = this.emailScheduleRepository.create(Object.assign(Object.assign({}, dto), { createdById: userId, isActive: (_a = dto.isActive) !== null && _a !== void 0 ? _a : true }));
        return this.emailScheduleRepository.save(schedule);
    }
    async updateSchedule(id, dto, userId) {
        const schedule = await this.emailScheduleRepository.findOne({ where: { id } });
        if (!schedule) {
            throw new Error('Dashboard email schedule not found');
        }
        if (dto.frequency || dto.dayOfWeek || dto.dayOfMonth || dto.sendTime) {
            const updatedDto = Object.assign(Object.assign({}, schedule), dto);
            this.validateScheduleConfig(updatedDto);
        }
        Object.assign(schedule, dto, { updatedById: userId });
        return this.emailScheduleRepository.save(schedule);
    }
    async deleteSchedule(id) {
        const result = await this.emailScheduleRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Dashboard email schedule not found');
        }
    }
    async getAllSchedules() {
        return this.emailScheduleRepository.find({
            relations: ['createdBy', 'updatedBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async getScheduleById(id) {
        const schedule = await this.emailScheduleRepository.findOne({
            where: { id },
            relations: ['createdBy', 'updatedBy'],
        });
        if (!schedule) {
            throw new Error('Dashboard email schedule not found');
        }
        return schedule;
    }
    async toggleScheduleStatus(id, userId) {
        const schedule = await this.emailScheduleRepository.findOne({ where: { id } });
        if (!schedule) {
            throw new Error('Dashboard email schedule not found');
        }
        schedule.isActive = !schedule.isActive;
        schedule.updatedById = userId;
        return this.emailScheduleRepository.save(schedule);
    }
    async sendScheduledEmails() {
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const currentDayOfMonth = now.getDate();
        const currentTime = now.toTimeString().slice(0, 5);
        const schedules = await this.emailScheduleRepository.find({
            where: { isActive: true },
        });
        for (const schedule of schedules) {
            let shouldSend = false;
            switch (schedule.frequency) {
                case dashboard_email_schedule_entity_1.EmailFrequency.DAILY:
                    shouldSend = schedule.sendTime === currentTime;
                    break;
                case dashboard_email_schedule_entity_1.EmailFrequency.WEEKLY:
                    shouldSend = schedule.dayOfWeek === currentDay && schedule.sendTime === currentTime;
                    break;
                case dashboard_email_schedule_entity_1.EmailFrequency.MONTHLY:
                    shouldSend = schedule.dayOfMonth === currentDayOfMonth && schedule.sendTime === currentTime;
                    break;
            }
            if (shouldSend) {
                try {
                    await this.sendDashboardEmail(schedule);
                    schedule.lastSentAt = now;
                    await this.emailScheduleRepository.save(schedule);
                    this.logger.log(`Sent dashboard email for schedule: ${schedule.name}`);
                }
                catch (error) {
                    this.logger.error(`Failed to send dashboard email for schedule ${schedule.id}:`, error);
                }
            }
        }
    }
    async sendDashboardEmail(schedule) {
        const dashboardData = await this.dashboardService.getDashboard();
        const emailContent = this.generateEmailContent(dashboardData, schedule);
        this.logger.log(`Sending dashboard email to: ${schedule.recipientEmails.join(', ')}`);
        this.logger.log(`Subject: ${schedule.name} - Governance Dashboard Report`);
        this.logger.log(`Content: ${emailContent}`);
    }
    generateEmailContent(dashboardData, schedule) {
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
    validateScheduleConfig(dto) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(dto.sendTime)) {
            throw new Error('Send time must be in HH:MM format');
        }
        switch (dto.frequency) {
            case dashboard_email_schedule_entity_1.EmailFrequency.WEEKLY:
                if (!dto.dayOfWeek) {
                    throw new Error('Day of week is required for weekly schedules');
                }
                break;
            case dashboard_email_schedule_entity_1.EmailFrequency.MONTHLY:
                if (!dto.dayOfMonth || dto.dayOfMonth < 1 || dto.dayOfMonth > 31) {
                    throw new Error('Day of month must be between 1 and 31 for monthly schedules');
                }
                break;
        }
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
};
exports.DashboardEmailService = DashboardEmailService;
exports.DashboardEmailService = DashboardEmailService = DashboardEmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dashboard_email_schedule_entity_1.DashboardEmailSchedule)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        governance_dashboard_service_1.GovernanceDashboardService])
], DashboardEmailService);
//# sourceMappingURL=dashboard-email.service.js.map