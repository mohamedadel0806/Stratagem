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
exports.SOPVersion = exports.VersionStatus = exports.VersionChangeType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const sop_entity_1 = require("./sop.entity");
var VersionChangeType;
(function (VersionChangeType) {
    VersionChangeType["MAJOR"] = "major";
    VersionChangeType["MINOR"] = "minor";
    VersionChangeType["PATCH"] = "patch";
})(VersionChangeType || (exports.VersionChangeType = VersionChangeType = {}));
var VersionStatus;
(function (VersionStatus) {
    VersionStatus["DRAFT"] = "draft";
    VersionStatus["PENDING_APPROVAL"] = "pending_approval";
    VersionStatus["APPROVED"] = "approved";
    VersionStatus["PUBLISHED"] = "published";
    VersionStatus["SUPERSEDED"] = "superseded";
})(VersionStatus || (exports.VersionStatus = VersionStatus = {}));
let SOPVersion = class SOPVersion {
};
exports.SOPVersion = SOPVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SOPVersion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'sop_id' }),
    __metadata("design:type", String)
], SOPVersion.prototype, "sop_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sop_entity_1.SOP, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sop_id' }),
    __metadata("design:type", sop_entity_1.SOP)
], SOPVersion.prototype, "sop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], SOPVersion.prototype, "version_number", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: VersionChangeType.MINOR,
    }),
    __metadata("design:type", String)
], SOPVersion.prototype, "change_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: VersionStatus.DRAFT,
    }),
    __metadata("design:type", String)
], SOPVersion.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SOPVersion.prototype, "change_summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SOPVersion.prototype, "change_details", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SOPVersion.prototype, "content_snapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SOPVersion.prototype, "metadata_snapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'previous_version_id' }),
    __metadata("design:type", String)
], SOPVersion.prototype, "previous_version_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'approved_by' }),
    __metadata("design:type", String)
], SOPVersion.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPVersion.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'approved_at' }),
    __metadata("design:type", Date)
], SOPVersion.prototype, "approved_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'approval_comments' }),
    __metadata("design:type", String)
], SOPVersion.prototype, "approval_comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'published_by' }),
    __metadata("design:type", String)
], SOPVersion.prototype, "published_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'published_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPVersion.prototype, "publisher", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'published_at' }),
    __metadata("design:type", Date)
], SOPVersion.prototype, "published_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'requires_retraining' }),
    __metadata("design:type", Boolean)
], SOPVersion.prototype, "requires_retraining", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_backward_compatible' }),
    __metadata("design:type", Boolean)
], SOPVersion.prototype, "is_backward_compatible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], SOPVersion.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPVersion.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SOPVersion.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], SOPVersion.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPVersion.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SOPVersion.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], SOPVersion.prototype, "deleted_at", void 0);
exports.SOPVersion = SOPVersion = __decorate([
    (0, typeorm_1.Entity)('sop_versions'),
    (0, typeorm_1.Index)(['sop_id']),
    (0, typeorm_1.Index)(['version_number']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['created_by'])
], SOPVersion);
//# sourceMappingURL=sop-version.entity.js.map