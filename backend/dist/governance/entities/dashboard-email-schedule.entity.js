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
exports.DashboardEmailSchedule = exports.EmailDayOfWeek = exports.EmailFrequency = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var EmailFrequency;
(function (EmailFrequency) {
    EmailFrequency["DAILY"] = "daily";
    EmailFrequency["WEEKLY"] = "weekly";
    EmailFrequency["MONTHLY"] = "monthly";
})(EmailFrequency || (exports.EmailFrequency = EmailFrequency = {}));
var EmailDayOfWeek;
(function (EmailDayOfWeek) {
    EmailDayOfWeek["MONDAY"] = "monday";
    EmailDayOfWeek["TUESDAY"] = "tuesday";
    EmailDayOfWeek["WEDNESDAY"] = "wednesday";
    EmailDayOfWeek["THURSDAY"] = "thursday";
    EmailDayOfWeek["FRIDAY"] = "friday";
    EmailDayOfWeek["SATURDAY"] = "saturday";
    EmailDayOfWeek["SUNDAY"] = "sunday";
})(EmailDayOfWeek || (exports.EmailDayOfWeek = EmailDayOfWeek = {}));
let DashboardEmailSchedule = class DashboardEmailSchedule {
};
exports.DashboardEmailSchedule = DashboardEmailSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DashboardEmailSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], DashboardEmailSchedule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DashboardEmailSchedule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EmailFrequency }),
    __metadata("design:type", String)
], DashboardEmailSchedule.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EmailDayOfWeek, nullable: true }),
    __metadata("design:type", String)
], DashboardEmailSchedule.prototype, "dayOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DashboardEmailSchedule.prototype, "dayOfMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], DashboardEmailSchedule.prototype, "sendTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array' }),
    __metadata("design:type", Array)
], DashboardEmailSchedule.prototype, "recipientEmails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DashboardEmailSchedule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], DashboardEmailSchedule.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], DashboardEmailSchedule.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], DashboardEmailSchedule.prototype, "updatedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by_id' }),
    __metadata("design:type", user_entity_1.User)
], DashboardEmailSchedule.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DashboardEmailSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DashboardEmailSchedule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], DashboardEmailSchedule.prototype, "lastSentAt", void 0);
exports.DashboardEmailSchedule = DashboardEmailSchedule = __decorate([
    (0, typeorm_1.Entity)('dashboard_email_schedules')
], DashboardEmailSchedule);
//# sourceMappingURL=dashboard-email-schedule.entity.js.map