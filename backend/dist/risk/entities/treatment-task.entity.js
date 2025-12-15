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
exports.TreatmentTask = void 0;
const typeorm_1 = require("typeorm");
const risk_treatment_entity_1 = require("./risk-treatment.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let TreatmentTask = class TreatmentTask {
};
exports.TreatmentTask = TreatmentTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TreatmentTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'treatment_id' }),
    __metadata("design:type", String)
], TreatmentTask.prototype, "treatment_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_treatment_entity_1.RiskTreatment, (treatment) => treatment.tasks, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'treatment_id' }),
    __metadata("design:type", risk_treatment_entity_1.RiskTreatment)
], TreatmentTask.prototype, "treatment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300 }),
    __metadata("design:type", String)
], TreatmentTask.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TreatmentTask.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'assignee_id' }),
    __metadata("design:type", String)
], TreatmentTask.prototype, "assignee_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignee_id' }),
    __metadata("design:type", user_entity_1.User)
], TreatmentTask.prototype, "assignee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'pending' }),
    __metadata("design:type", String)
], TreatmentTask.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'due_date' }),
    __metadata("design:type", Date)
], TreatmentTask.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'completed_date' }),
    __metadata("design:type", Date)
], TreatmentTask.prototype, "completed_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'display_order' }),
    __metadata("design:type", Number)
], TreatmentTask.prototype, "display_order", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TreatmentTask.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TreatmentTask.prototype, "updated_at", void 0);
exports.TreatmentTask = TreatmentTask = __decorate([
    (0, typeorm_1.Entity)('treatment_tasks'),
    (0, typeorm_1.Index)(['treatment_id']),
    (0, typeorm_1.Index)(['status'])
], TreatmentTask);
//# sourceMappingURL=treatment-task.entity.js.map