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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardEmailScheduleDto = exports.UpdateDashboardEmailScheduleDto = exports.CreateDashboardEmailScheduleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const dashboard_email_schedule_entity_1 = require("../entities/dashboard-email-schedule.entity");
class CreateDashboardEmailScheduleDto {
}
exports.CreateDashboardEmailScheduleDto = CreateDashboardEmailScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDashboardEmailScheduleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CreateDashboardEmailScheduleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: dashboard_email_schedule_entity_1.EmailFrequency }),
    __metadata("design:type", String)
], CreateDashboardEmailScheduleDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: dashboard_email_schedule_entity_1.EmailDayOfWeek, required: false }),
    __metadata("design:type", String)
], CreateDashboardEmailScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, minimum: 1, maximum: 31 }),
    __metadata("design:type", Number)
], CreateDashboardEmailScheduleDto.prototype, "dayOfMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Send time in HH:MM format' }),
    __metadata("design:type", String)
], CreateDashboardEmailScheduleDto.prototype, "sendTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], CreateDashboardEmailScheduleDto.prototype, "recipientEmails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    __metadata("design:type", Boolean)
], CreateDashboardEmailScheduleDto.prototype, "isActive", void 0);
class UpdateDashboardEmailScheduleDto {
}
exports.UpdateDashboardEmailScheduleDto = UpdateDashboardEmailScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateDashboardEmailScheduleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateDashboardEmailScheduleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: dashboard_email_schedule_entity_1.EmailFrequency, required: false }),
    __metadata("design:type", String)
], UpdateDashboardEmailScheduleDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: dashboard_email_schedule_entity_1.EmailDayOfWeek, required: false }),
    __metadata("design:type", String)
], UpdateDashboardEmailScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, minimum: 1, maximum: 31 }),
    __metadata("design:type", Number)
], UpdateDashboardEmailScheduleDto.prototype, "dayOfMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Send time in HH:MM format' }),
    __metadata("design:type", String)
], UpdateDashboardEmailScheduleDto.prototype, "sendTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    __metadata("design:type", Array)
], UpdateDashboardEmailScheduleDto.prototype, "recipientEmails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], UpdateDashboardEmailScheduleDto.prototype, "isActive", void 0);
class DashboardEmailScheduleDto {
}
exports.DashboardEmailScheduleDto = DashboardEmailScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DashboardEmailScheduleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DashboardEmailScheduleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], DashboardEmailScheduleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: dashboard_email_schedule_entity_1.EmailFrequency }),
    __metadata("design:type", String)
], DashboardEmailScheduleDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: dashboard_email_schedule_entity_1.EmailDayOfWeek, required: false }),
    __metadata("design:type", String)
], DashboardEmailScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], DashboardEmailScheduleDto.prototype, "dayOfMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DashboardEmailScheduleDto.prototype, "sendTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], DashboardEmailScheduleDto.prototype, "recipientEmails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], DashboardEmailScheduleDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DashboardEmailScheduleDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DashboardEmailScheduleDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], DashboardEmailScheduleDto.prototype, "lastSentAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], DashboardEmailScheduleDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], DashboardEmailScheduleDto.prototype, "updatedBy", void 0);
//# sourceMappingURL=dashboard-email.dto.js.map