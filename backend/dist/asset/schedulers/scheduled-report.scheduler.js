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
var ScheduledReportScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledReportScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_template_entity_1 = require("../entities/report-template.entity");
const report_template_service_1 = require("../services/report-template.service");
let ScheduledReportScheduler = ScheduledReportScheduler_1 = class ScheduledReportScheduler {
    constructor(templateRepository, reportTemplateService) {
        this.templateRepository = templateRepository;
        this.reportTemplateService = reportTemplateService;
        this.logger = new common_1.Logger(ScheduledReportScheduler_1.name);
    }
    async handleScheduledReports() {
        this.logger.log('Checking for scheduled reports...');
        try {
            const now = new Date();
            const templates = await this.templateRepository.find({
                where: {
                    isScheduled: true,
                    isActive: true,
                    nextRunAt: (0, typeorm_2.LessThanOrEqual)(now),
                },
            });
            for (const template of templates) {
                try {
                    await this.reportTemplateService.sendScheduledReport(template.id);
                }
                catch (error) {
                    this.logger.error(`Failed to send scheduled report ${template.name}:`, error);
                }
            }
            this.logger.log(`Processed ${templates.length} scheduled reports`);
        }
        catch (error) {
            this.logger.error('Error processing scheduled reports:', error);
        }
    }
};
exports.ScheduledReportScheduler = ScheduledReportScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduledReportScheduler.prototype, "handleScheduledReports", null);
exports.ScheduledReportScheduler = ScheduledReportScheduler = ScheduledReportScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_template_entity_1.ReportTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        report_template_service_1.ReportTemplateService])
], ScheduledReportScheduler);
//# sourceMappingURL=scheduled-report.scheduler.js.map