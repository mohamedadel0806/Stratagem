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
exports.SOPSchedule = exports.ScheduleStatus = exports.ScheduleFrequency = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const sop_entity_1 = require("./sop.entity");
var ScheduleFrequency;
(function (ScheduleFrequency) {
    ScheduleFrequency["DAILY"] = "daily";
    ScheduleFrequency["WEEKLY"] = "weekly";
    ScheduleFrequency["MONTHLY"] = "monthly";
    ScheduleFrequency["QUARTERLY"] = "quarterly";
    ScheduleFrequency["ANNUALLY"] = "annually";
})(ScheduleFrequency || (exports.ScheduleFrequency = ScheduleFrequency = {}));
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["ACTIVE"] = "active";
    ScheduleStatus["INACTIVE"] = "inactive";
    ScheduleStatus["PAUSED"] = "paused";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
let SOPSchedule = class SOPSchedule {
};
exports.SOPSchedule = SOPSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SOPSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'sop_id' }),
    __metadata("design:type", String)
], SOPSchedule.prototype, "sop_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sop_entity_1.SOP, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sop_id' }),
    __metadata("design:type", sop_entity_1.SOP)
], SOPSchedule.prototype, "sop", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: ScheduleFrequency.MONTHLY,
    }),
    __metadata("design:type", String)
], SOPSchedule.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'day_of_week' }),
    __metadata("design:type", Number)
], SOPSchedule.prototype, "day_of_week", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'day_of_month' }),
    __metadata("design:type", Number)
], SOPSchedule.prototype, "day_of_month", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true, name: 'execution_time' }),
    __metadata("design:type", String)
], SOPSchedule.prototype, "execution_time", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: ScheduleStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], SOPSchedule.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
        name: 'next_execution_date',
    }),
    __metadata("design:type", Date)
], SOPSchedule.prototype, "next_execution_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
        name: 'last_execution_date',
    }),
    __metadata("design:type", Date)
], SOPSchedule.prototype, "last_execution_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'execution_count' }),
    __metadata("design:type", Number)
], SOPSchedule.prototype, "execution_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'assigned_user_ids' }),
    __metadata("design:type", Array)
], SOPSchedule.prototype, "assigned_user_ids", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'assigned_role_ids' }),
    __metadata("design:type", Array)
], SOPSchedule.prototype, "assigned_role_ids", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'reminder_template' }),
    __metadata("design:type", String)
], SOPSchedule.prototype, "reminder_template", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 7, name: 'reminder_days_before' }),
    __metadata("design:type", Number)
], SOPSchedule.prototype, "reminder_days_before", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'send_reminders' }),
    __metadata("design:type", Boolean)
], SOPSchedule.prototype, "send_reminders", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], SOPSchedule.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPSchedule.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SOPSchedule.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], SOPSchedule.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPSchedule.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SOPSchedule.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], SOPSchedule.prototype, "deleted_at", void 0);
exports.SOPSchedule = SOPSchedule = __decorate([
    (0, typeorm_1.Entity)('sop_schedules'),
    (0, typeorm_1.Index)(['sop_id']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['next_execution_date']),
    (0, typeorm_1.Index)(['created_by'])
], SOPSchedule);
//# sourceMappingURL=sop-schedule.entity.js.map