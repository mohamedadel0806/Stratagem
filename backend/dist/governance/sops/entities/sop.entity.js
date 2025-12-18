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
exports.SOP = exports.ExecutionOutcome = exports.SOPCategory = exports.SOPStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const unified_control_entity_1 = require("../../unified-controls/entities/unified-control.entity");
var SOPStatus;
(function (SOPStatus) {
    SOPStatus["DRAFT"] = "draft";
    SOPStatus["IN_REVIEW"] = "in_review";
    SOPStatus["APPROVED"] = "approved";
    SOPStatus["PUBLISHED"] = "published";
    SOPStatus["ARCHIVED"] = "archived";
})(SOPStatus || (exports.SOPStatus = SOPStatus = {}));
var SOPCategory;
(function (SOPCategory) {
    SOPCategory["OPERATIONAL"] = "operational";
    SOPCategory["SECURITY"] = "security";
    SOPCategory["COMPLIANCE"] = "compliance";
    SOPCategory["THIRD_PARTY"] = "third_party";
})(SOPCategory || (exports.SOPCategory = SOPCategory = {}));
var ExecutionOutcome;
(function (ExecutionOutcome) {
    ExecutionOutcome["SUCCESSFUL"] = "successful";
    ExecutionOutcome["FAILED"] = "failed";
    ExecutionOutcome["PARTIALLY_COMPLETED"] = "partially_completed";
})(ExecutionOutcome || (exports.ExecutionOutcome = ExecutionOutcome = {}));
let SOP = class SOP {
};
exports.SOP = SOP;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SOP.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'sop_identifier' }),
    __metadata("design:type", String)
], SOP.prototype, "sop_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], SOP.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SOP.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SOP.prototype, "subcategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SOP.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SOP.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SOP.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], SOP.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1, name: 'version_number' }),
    __metadata("design:type", Number)
], SOP.prototype, "version_number", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: SOPStatus.DRAFT,
    }),
    __metadata("design:type", String)
], SOP.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'owner_id' }),
    __metadata("design:type", String)
], SOP.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], SOP.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'review_frequency' }),
    __metadata("design:type", String)
], SOP.prototype, "review_frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'next_review_date' }),
    __metadata("design:type", Date)
], SOP.prototype, "next_review_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'approval_date' }),
    __metadata("design:type", Date)
], SOP.prototype, "approval_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'published_date' }),
    __metadata("design:type", Date)
], SOP.prototype, "published_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'linked_policies' }),
    __metadata("design:type", Array)
], SOP.prototype, "linked_policies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'linked_standards' }),
    __metadata("design:type", Array)
], SOP.prototype, "linked_standards", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], SOP.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], SOP.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], SOP.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SOP.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], SOP.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], SOP.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SOP.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], SOP.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => unified_control_entity_1.UnifiedControl),
    (0, typeorm_1.JoinTable)({
        name: 'sop_control_mappings',
        joinColumn: { name: 'sop_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'unified_control_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], SOP.prototype, "controls", void 0);
exports.SOP = SOP = __decorate([
    (0, typeorm_1.Entity)('sops'),
    (0, typeorm_1.Index)(['sop_identifier']),
    (0, typeorm_1.Index)(['category']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['owner_id'])
], SOP);
//# sourceMappingURL=sop.entity.js.map