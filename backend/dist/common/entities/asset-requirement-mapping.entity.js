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
exports.AssetRequirementMapping = exports.AssetTypeEnum = exports.ComplianceStatus = void 0;
const typeorm_1 = require("typeorm");
const compliance_requirement_entity_1 = require("./compliance-requirement.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["NOT_ASSESSED"] = "not_assessed";
    ComplianceStatus["COMPLIANT"] = "compliant";
    ComplianceStatus["NON_COMPLIANT"] = "non_compliant";
    ComplianceStatus["PARTIALLY_COMPLIANT"] = "partially_compliant";
    ComplianceStatus["NOT_APPLICABLE"] = "not_applicable";
    ComplianceStatus["REQUIRES_REVIEW"] = "requires_review";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
var AssetTypeEnum;
(function (AssetTypeEnum) {
    AssetTypeEnum["PHYSICAL"] = "physical";
    AssetTypeEnum["INFORMATION"] = "information";
    AssetTypeEnum["APPLICATION"] = "application";
    AssetTypeEnum["SOFTWARE"] = "software";
    AssetTypeEnum["SUPPLIER"] = "supplier";
})(AssetTypeEnum || (exports.AssetTypeEnum = AssetTypeEnum = {}));
let AssetRequirementMapping = class AssetRequirementMapping {
};
exports.AssetRequirementMapping = AssetRequirementMapping;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssetRequirementMapping.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'asset_type' }),
    __metadata("design:type", String)
], AssetRequirementMapping.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'asset_id' }),
    __metadata("design:type", String)
], AssetRequirementMapping.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compliance_requirement_entity_1.ComplianceRequirement, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requirement_id' }),
    __metadata("design:type", compliance_requirement_entity_1.ComplianceRequirement)
], AssetRequirementMapping.prototype, "requirement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'requirement_id' }),
    __metadata("design:type", String)
], AssetRequirementMapping.prototype, "requirementId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ComplianceStatus,
        default: ComplianceStatus.NOT_ASSESSED,
        name: 'compliance_status',
    }),
    __metadata("design:type", String)
], AssetRequirementMapping.prototype, "complianceStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'last_assessed_at' }),
    __metadata("design:type", Date)
], AssetRequirementMapping.prototype, "lastAssessedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'assessed_by' }),
    __metadata("design:type", user_entity_1.User)
], AssetRequirementMapping.prototype, "assessedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'assessed_by' }),
    __metadata("design:type", String)
], AssetRequirementMapping.prototype, "assessedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '[]', name: 'evidence_urls' }),
    __metadata("design:type", Array)
], AssetRequirementMapping.prototype, "evidenceUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetRequirementMapping.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'auto_assessed' }),
    __metadata("design:type", Boolean)
], AssetRequirementMapping.prototype, "autoAssessed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssetRequirementMapping.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssetRequirementMapping.prototype, "updatedAt", void 0);
exports.AssetRequirementMapping = AssetRequirementMapping = __decorate([
    (0, typeorm_1.Entity)('asset_requirement_mapping'),
    (0, typeorm_1.Unique)(['assetType', 'assetId', 'requirementId']),
    (0, typeorm_1.Index)(['assetType', 'assetId']),
    (0, typeorm_1.Index)(['requirementId']),
    (0, typeorm_1.Index)(['complianceStatus'])
], AssetRequirementMapping);
//# sourceMappingURL=asset-requirement-mapping.entity.js.map