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
var GovernanceScheduleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceScheduleService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const governance_trend_service_1 = require("./governance-trend.service");
let GovernanceScheduleService = GovernanceScheduleService_1 = class GovernanceScheduleService {
    constructor(trendService) {
        this.trendService = trendService;
        this.logger = new common_1.Logger(GovernanceScheduleService_1.name);
    }
    async captureGovernanceSnapshot() {
        try {
            this.logger.debug('Starting daily governance snapshot capture...');
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            await this.trendService.ensureSnapshotForDate(today);
            this.logger.log(`✅ Daily snapshot captured for ${today.toISOString().split('T')[0]}`);
        }
        catch (error) {
            this.logger.error('Failed to capture daily governance snapshot', error.stack);
        }
    }
};
exports.GovernanceScheduleService = GovernanceScheduleService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceScheduleService.prototype, "captureGovernanceSnapshot", null);
exports.GovernanceScheduleService = GovernanceScheduleService = GovernanceScheduleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [governance_trend_service_1.GovernanceTrendService])
], GovernanceScheduleService);
//# sourceMappingURL=governance-schedule.service.js.map