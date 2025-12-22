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
exports.ComplianceObligation = exports.ObligationPriority = exports.ObligationStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const influencer_entity_1 = require("../../influencers/entities/influencer.entity");
const business_unit_entity_1 = require("../../../common/entities/business-unit.entity");
var ObligationStatus;
(function (ObligationStatus) {
    ObligationStatus["NOT_STARTED"] = "not_started";
    ObligationStatus["IN_PROGRESS"] = "in_progress";
    ObligationStatus["MET"] = "met";
    ObligationStatus["PARTIALLY_MET"] = "partially_met";
    ObligationStatus["NOT_MET"] = "not_met";
    ObligationStatus["NOT_APPLICABLE"] = "not_applicable";
    ObligationStatus["OVERDUE"] = "overdue";
})(ObligationStatus || (exports.ObligationStatus = ObligationStatus = {}));
var ObligationPriority;
(function (ObligationPriority) {
    ObligationPriority["CRITICAL"] = "critical";
    ObligationPriority["HIGH"] = "high";
    ObligationPriority["MEDIUM"] = "medium";
    ObligationPriority["LOW"] = "low";
})(ObligationPriority || (exports.ObligationPriority = ObligationPriority = {}));
let ComplianceObligation = class ComplianceObligation {
};
exports.ComplianceObligation = ComplianceObligation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'obligation_identifier' }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "obligation_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'influencer_id', nullable: true }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "influencer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => influencer_entity_1.Influencer, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'influencer_id' }),
    __metadata("design:type", influencer_entity_1.Influencer)
], ComplianceObligation.prototype, "influencer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "source_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'owner_id' }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], ComplianceObligation.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'business_unit_id' }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "business_unit_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_unit_entity_1.BusinessUnit, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'business_unit_id' }),
    __metadata("design:type", business_unit_entity_1.BusinessUnit)
], ComplianceObligation.prototype, "business_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ObligationStatus,
        default: ObligationStatus.NOT_STARTED,
    }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ObligationPriority,
        default: ObligationPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'due_date' }),
    __metadata("design:type", Date)
], ComplianceObligation.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'completion_date' }),
    __metadata("design:type", Date)
], ComplianceObligation.prototype, "completion_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "evidence_summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ComplianceObligation.prototype, "custom_fields", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], ComplianceObligation.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ComplianceObligation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], ComplianceObligation.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], ComplianceObligation.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ComplianceObligation.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], ComplianceObligation.prototype, "deleted_at", void 0);
exports.ComplianceObligation = ComplianceObligation = __decorate([
    (0, typeorm_1.Entity)('compliance_obligations'),
    (0, typeorm_1.Index)(['influencer_id']),
    (0, typeorm_1.Index)(['owner_id']),
    (0, typeorm_1.Index)(['business_unit_id']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['priority'])
], ComplianceObligation);
//# sourceMappingURL=compliance-obligation.entity.js.map