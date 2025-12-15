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
exports.Evidence = exports.EvidenceStatus = exports.EvidenceType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const evidence_linkage_entity_1 = require("./evidence-linkage.entity");
var EvidenceType;
(function (EvidenceType) {
    EvidenceType["POLICY_DOCUMENT"] = "policy_document";
    EvidenceType["CONFIGURATION_SCREENSHOT"] = "configuration_screenshot";
    EvidenceType["SYSTEM_LOG"] = "system_log";
    EvidenceType["SCAN_REPORT"] = "scan_report";
    EvidenceType["TEST_RESULT"] = "test_result";
    EvidenceType["CERTIFICATION"] = "certification";
    EvidenceType["TRAINING_RECORD"] = "training_record";
    EvidenceType["MEETING_MINUTES"] = "meeting_minutes";
    EvidenceType["EMAIL_CORRESPONDENCE"] = "email_correspondence";
    EvidenceType["CONTRACT"] = "contract";
    EvidenceType["OTHER"] = "other";
})(EvidenceType || (exports.EvidenceType = EvidenceType = {}));
var EvidenceStatus;
(function (EvidenceStatus) {
    EvidenceStatus["DRAFT"] = "draft";
    EvidenceStatus["UNDER_REVIEW"] = "under_review";
    EvidenceStatus["APPROVED"] = "approved";
    EvidenceStatus["EXPIRED"] = "expired";
    EvidenceStatus["REJECTED"] = "rejected";
})(EvidenceStatus || (exports.EvidenceStatus = EvidenceStatus = {}));
let Evidence = class Evidence {
};
exports.Evidence = Evidence;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Evidence.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'evidence_identifier' }),
    __metadata("design:type", String)
], Evidence.prototype, "evidence_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Evidence.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Evidence.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EvidenceType,
        name: 'evidence_type',
    }),
    __metadata("design:type", String)
], Evidence.prototype, "evidence_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Evidence.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'file_path' }),
    __metadata("design:type", String)
], Evidence.prototype, "file_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true, name: 'file_size' }),
    __metadata("design:type", Number)
], Evidence.prototype, "file_size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true, name: 'mime_type' }),
    __metadata("design:type", String)
], Evidence.prototype, "mime_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 128, nullable: true, name: 'file_hash' }),
    __metadata("design:type", String)
], Evidence.prototype, "file_hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: () => 'CURRENT_DATE', name: 'collection_date' }),
    __metadata("design:type", Date)
], Evidence.prototype, "collection_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'valid_from_date' }),
    __metadata("design:type", Date)
], Evidence.prototype, "valid_from_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'valid_until_date' }),
    __metadata("design:type", Date)
], Evidence.prototype, "valid_until_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'collector_id' }),
    __metadata("design:type", String)
], Evidence.prototype, "collector_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'collector_id' }),
    __metadata("design:type", user_entity_1.User)
], Evidence.prototype, "collector", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EvidenceStatus,
        default: EvidenceStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Evidence.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'approved_by' }),
    __metadata("design:type", String)
], Evidence.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", user_entity_1.User)
], Evidence.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'approval_date' }),
    __metadata("design:type", Date)
], Evidence.prototype, "approval_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'rejection_reason' }),
    __metadata("design:type", String)
], Evidence.prototype, "rejection_reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], Evidence.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'custom_metadata' }),
    __metadata("design:type", Object)
], Evidence.prototype, "custom_metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Evidence.prototype, "confidential", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'restricted_to_roles' }),
    __metadata("design:type", Array)
], Evidence.prototype, "restricted_to_roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => evidence_linkage_entity_1.EvidenceLinkage, (linkage) => linkage.evidence),
    __metadata("design:type", Array)
], Evidence.prototype, "linkages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], Evidence.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Evidence.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Evidence.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Evidence.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Evidence.prototype, "deleted_at", void 0);
exports.Evidence = Evidence = __decorate([
    (0, typeorm_1.Entity)('evidence'),
    (0, typeorm_1.Index)(['evidence_identifier']),
    (0, typeorm_1.Index)(['evidence_type']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['collector_id']),
    (0, typeorm_1.Index)(['valid_until_date'])
], Evidence);
//# sourceMappingURL=evidence.entity.js.map