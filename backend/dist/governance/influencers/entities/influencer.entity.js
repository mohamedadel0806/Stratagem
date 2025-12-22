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
exports.Influencer = exports.ApplicabilityStatus = exports.InfluencerStatus = exports.InfluencerCategory = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
var InfluencerCategory;
(function (InfluencerCategory) {
    InfluencerCategory["INTERNAL"] = "internal";
    InfluencerCategory["CONTRACTUAL"] = "contractual";
    InfluencerCategory["STATUTORY"] = "statutory";
    InfluencerCategory["REGULATORY"] = "regulatory";
    InfluencerCategory["INDUSTRY_STANDARD"] = "industry_standard";
})(InfluencerCategory || (exports.InfluencerCategory = InfluencerCategory = {}));
var InfluencerStatus;
(function (InfluencerStatus) {
    InfluencerStatus["ACTIVE"] = "active";
    InfluencerStatus["PENDING"] = "pending";
    InfluencerStatus["SUPERSEDED"] = "superseded";
    InfluencerStatus["RETIRED"] = "retired";
})(InfluencerStatus || (exports.InfluencerStatus = InfluencerStatus = {}));
var ApplicabilityStatus;
(function (ApplicabilityStatus) {
    ApplicabilityStatus["APPLICABLE"] = "applicable";
    ApplicabilityStatus["NOT_APPLICABLE"] = "not_applicable";
    ApplicabilityStatus["UNDER_REVIEW"] = "under_review";
})(ApplicabilityStatus || (exports.ApplicabilityStatus = ApplicabilityStatus = {}));
let Influencer = class Influencer {
};
exports.Influencer = Influencer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Influencer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Influencer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InfluencerCategory,
        name: 'category',
    }),
    __metadata("design:type", String)
], Influencer.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Influencer.prototype, "sub_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true }),
    __metadata("design:type", String)
], Influencer.prototype, "issuing_authority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Influencer.prototype, "jurisdiction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, unique: true, nullable: true }),
    __metadata("design:type", String)
], Influencer.prototype, "reference_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Influencer.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Influencer.prototype, "publication_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Influencer.prototype, "effective_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Influencer.prototype, "last_revision_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'revision_notes' }),
    __metadata("design:type", String)
], Influencer.prototype, "revision_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Influencer.prototype, "next_review_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'review_frequency_days' }),
    __metadata("design:type", Number)
], Influencer.prototype, "review_frequency_days", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InfluencerStatus,
        default: InfluencerStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Influencer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApplicabilityStatus,
        default: ApplicabilityStatus.UNDER_REVIEW,
        name: 'applicability_status',
    }),
    __metadata("design:type", String)
], Influencer.prototype, "applicability_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'applicability_justification' }),
    __metadata("design:type", String)
], Influencer.prototype, "applicability_justification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'applicability_assessment_date' }),
    __metadata("design:type", Date)
], Influencer.prototype, "applicability_assessment_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'applicability_criteria' }),
    __metadata("design:type", Object)
], Influencer.prototype, "applicability_criteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'source_url' }),
    __metadata("design:type", String)
], Influencer.prototype, "source_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'source_document_path' }),
    __metadata("design:type", String)
], Influencer.prototype, "source_document_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'owner_id' }),
    __metadata("design:type", String)
], Influencer.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], Influencer.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'business_units_affected' }),
    __metadata("design:type", Array)
], Influencer.prototype, "business_units_affected", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], Influencer.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'custom_fields' }),
    __metadata("design:type", Object)
], Influencer.prototype, "custom_fields", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], Influencer.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Influencer.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Influencer.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], Influencer.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], Influencer.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Influencer.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Influencer.prototype, "deleted_at", void 0);
exports.Influencer = Influencer = __decorate([
    (0, typeorm_1.Entity)('influencers'),
    (0, typeorm_1.Index)(['category']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['applicability_status']),
    (0, typeorm_1.Index)(['owner_id']),
    (0, typeorm_1.Index)(['reference_number'])
], Influencer);
//# sourceMappingURL=influencer.entity.js.map