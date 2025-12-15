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
exports.SoftwareAsset = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const business_unit_entity_1 = require("../../common/entities/business-unit.entity");
let SoftwareAsset = class SoftwareAsset {
};
exports.SoftwareAsset = SoftwareAsset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: false, name: 'unique_identifier' }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: false }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "softwareName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "softwareType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "versionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "patchLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "businessPurpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], SoftwareAsset.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "businessUnitId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_unit_entity_1.BusinessUnit, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'business_unit_id' }),
    __metadata("design:type", business_unit_entity_1.BusinessUnit)
], SoftwareAsset.prototype, "businessUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "vendorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SoftwareAsset.prototype, "vendorContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "licenseType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SoftwareAsset.prototype, "licenseCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "licenseKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SoftwareAsset.prototype, "licenseExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SoftwareAsset.prototype, "installationCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SoftwareAsset.prototype, "securityTestResults", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SoftwareAsset.prototype, "lastSecurityTestDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], SoftwareAsset.prototype, "knownVulnerabilities", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SoftwareAsset.prototype, "supportEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], SoftwareAsset.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SoftwareAsset.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SoftwareAsset.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], SoftwareAsset.prototype, "updatedByUser", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SoftwareAsset.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'deleted_at' }),
    __metadata("design:type", Date)
], SoftwareAsset.prototype, "deletedAt", void 0);
exports.SoftwareAsset = SoftwareAsset = __decorate([
    (0, typeorm_1.Entity)('software_assets'),
    (0, typeorm_1.Index)(['softwareName']),
    (0, typeorm_1.Index)(['softwareType']),
    (0, typeorm_1.Index)(['ownerId']),
    (0, typeorm_1.Index)(['businessUnitId']),
    (0, typeorm_1.Index)(['vendorName']),
    (0, typeorm_1.Index)(['licenseExpiry'], { where: 'license_expiry IS NOT NULL' })
], SoftwareAsset);
//# sourceMappingURL=software-asset.entity.js.map