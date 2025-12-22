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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardEmailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_email_service_1 = require("../services/dashboard-email.service");
const dashboard_email_schedule_entity_1 = require("../entities/dashboard-email-schedule.entity");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
let DashboardEmailController = class DashboardEmailController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async createSchedule(dto, user) {
        return this.emailService.createSchedule(dto, user.userId);
    }
    async getAllSchedules() {
        return this.emailService.getAllSchedules();
    }
    async getScheduleById(id) {
        return this.emailService.getScheduleById(id);
    }
    async updateSchedule(id, dto, user) {
        return this.emailService.updateSchedule(id, dto, user.userId);
    }
    async deleteSchedule(id) {
        return this.emailService.deleteSchedule(id);
    }
    async toggleScheduleStatus(id, user) {
        return this.emailService.toggleScheduleStatus(id, user.userId);
    }
    async sendTestEmail(id) {
        const schedule = await this.emailService.getScheduleById(id);
        return Promise.resolve();
    }
};
exports.DashboardEmailController = DashboardEmailController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new dashboard email schedule' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Dashboard email schedule created successfully',
        type: dashboard_email_schedule_entity_1.DashboardEmailSchedule,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardEmailController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all dashboard email schedules' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of dashboard email schedules',
        type: [dashboard_email_schedule_entity_1.DashboardEmailSchedule],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardEmailController.prototype, "getAllSchedules", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a dashboard email schedule by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dashboard email schedule ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard email schedule details',
        type: dashboard_email_schedule_entity_1.DashboardEmailSchedule,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardEmailController.prototype, "getScheduleById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a dashboard email schedule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dashboard email schedule ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard email schedule updated successfully',
        type: dashboard_email_schedule_entity_1.DashboardEmailSchedule,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardEmailController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a dashboard email schedule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dashboard email schedule ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard email schedule deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardEmailController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Put)(':id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle the active status of a dashboard email schedule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dashboard email schedule ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard email schedule status toggled successfully',
        type: dashboard_email_schedule_entity_1.DashboardEmailSchedule,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DashboardEmailController.prototype, "toggleScheduleStatus", null);
__decorate([
    (0, common_1.Post)('test-send/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a test dashboard email for a schedule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dashboard email schedule ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Test email sent successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardEmailController.prototype, "sendTestEmail", null);
exports.DashboardEmailController = DashboardEmailController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('governance/dashboard/email-schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [dashboard_email_service_1.DashboardEmailService])
], DashboardEmailController);
//# sourceMappingURL=dashboard-email.controller.js.map