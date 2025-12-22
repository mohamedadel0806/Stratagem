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
exports.Policy = exports.ReviewFrequency = exports.PolicyStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const control_objective_entity_1 = require("../../control-objectives/entities/control-objective.entity");
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["DRAFT"] = "draft";
    PolicyStatus["IN_REVIEW"] = "in_review";
    PolicyStatus["APPROVED"] = "approved";
    PolicyStatus["PUBLISHED"] = "published";
    PolicyStatus["ARCHIVED"] = "archived";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
var ReviewFrequency;
(function (ReviewFrequency) {
    ReviewFrequency["ANNUAL"] = "annual";
    ReviewFrequency["BIENNIAL"] = "biennial";
    ReviewFrequency["TRIENNIAL"] = "triennial";
    ReviewFrequency["QUARTERLY"] = "quarterly";
    ReviewFrequency["MONTHLY"] = "monthly";
    ReviewFrequency["AS_NEEDED"] = "as_needed";
})(ReviewFrequency || (exports.ReviewFrequency = ReviewFrequency = {}));
let Policy = class Policy {
};
exports.Policy = Policy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Policy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, name: 'policy_type' }),
    __metadata("design:type", String)
], Policy.prototype, "policy_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Policy.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: '1.0' }),
    __metadata("design:type", String)
], Policy.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1, name: 'version_number' }),
    __metadata("design:type", Number)
], Policy.prototype, "version_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Policy.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Policy.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Policy.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'owner_id' }),
    __metadata("design:type", String)
], Policy.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], Policy.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'business_units' }),
    __metadata("design:type", Array)
], Policy.prototype, "business_units", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PolicyStatus,
        default: PolicyStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Policy.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'approval_date' }),
    __metadata("design:type", Date)
], Policy.prototype, "approval_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'effective_date' }),
    __metadata("design:type", Date)
], Policy.prototype, "effective_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReviewFrequency,
        default: ReviewFrequency.ANNUAL,
        name: 'review_frequency',
    }),
    __metadata("design:type", String)
], Policy.prototype, "review_frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'next_review_date' }),
    __metadata("design:type", Date)
], Policy.prototype, "next_review_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'published_date' }),
    __metadata("design:type", Date)
], Policy.prototype, "published_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'linked_influencers' }),
    __metadata("design:type", Array)
], Policy.prototype, "linked_influencers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'supersedes_policy_id' }),
    __metadata("design:type", String)
], Policy.prototype, "supersedes_policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Policy, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'supersedes_policy_id' }),
    __metadata("design:type", Policy)
], Policy.prototype, "supersedes_policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'parent_policy_id' }),
    __metadata("design:type", String)
], Policy.prototype, "parent_policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Policy, (policy) => policy.child_policies, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_policy_id' }),
    __metadata("design:type", Policy)
], Policy.prototype, "parent_policy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Policy, (policy) => policy.parent_policy),
    __metadata("design:type", Array)
], Policy.prototype, "child_policies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Policy.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], Policy.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'custom_fields' }),
    __metadata("design:type", Object)
], Policy.prototype, "custom_fields", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'requires_acknowledgment' }),
    __metadata("design:type", Boolean)
], Policy.prototype, "requires_acknowledgment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 30, name: 'acknowledgment_due_days' }),
    __metadata("design:type", Number)
], Policy.prototype, "acknowledgment_due_days", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => control_objective_entity_1.ControlObjective, (co) => co.policy),
    __metadata("design:type", Array)
], Policy.prototype, "control_objectives", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], Policy.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Policy.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Policy.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], Policy.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], Policy.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Policy.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Policy.prototype, "deleted_at", void 0);
exports.Policy = Policy = __decorate([
    (0, typeorm_1.Entity)('policies'),
    (0, typeorm_1.Index)(['policy_type']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['owner_id']),
    (0, typeorm_1.Index)(['title', 'version_number']),
    (0, typeorm_1.Index)(['parent_policy_id'])
], Policy);
//# sourceMappingURL=policy.entity.js.map