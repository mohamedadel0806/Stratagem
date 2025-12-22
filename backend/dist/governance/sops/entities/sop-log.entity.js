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
exports.SOPLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const sop_entity_1 = require("./sop.entity");
let SOPLog = class SOPLog {
};
exports.SOPLog = SOPLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SOPLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'sop_id' }),
    __metadata("design:type", String)
], SOPLog.prototype, "sop_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sop_entity_1.SOP, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sop_id' }),
    __metadata("design:type", sop_entity_1.SOP)
], SOPLog.prototype, "sop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'execution_date' }),
    __metadata("design:type", Date)
], SOPLog.prototype, "execution_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true, name: 'start_time' }),
    __metadata("design:type", Date)
], SOPLog.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true, name: 'end_time' }),
    __metadata("design:type", Date)
], SOPLog.prototype, "end_time", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: sop_entity_1.ExecutionOutcome,
        default: sop_entity_1.ExecutionOutcome.SUCCESSFUL,
    }),
    __metadata("design:type", String)
], SOPLog.prototype, "outcome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SOPLog.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'step_results' }),
    __metadata("design:type", Array)
], SOPLog.prototype, "step_results", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'executor_id' }),
    __metadata("design:type", String)
], SOPLog.prototype, "executor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'executor_id' }),
    __metadata("design:type", user_entity_1.User)
], SOPLog.prototype, "executor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], SOPLog.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPLog.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SOPLog.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], SOPLog.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPLog.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SOPLog.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], SOPLog.prototype, "deleted_at", void 0);
exports.SOPLog = SOPLog = __decorate([
    (0, typeorm_1.Entity)('sop_logs'),
    (0, typeorm_1.Index)(['sop_id']),
    (0, typeorm_1.Index)(['executor_id']),
    (0, typeorm_1.Index)(['execution_date']),
    (0, typeorm_1.Index)(['outcome'])
], SOPLog);
//# sourceMappingURL=sop-log.entity.js.map