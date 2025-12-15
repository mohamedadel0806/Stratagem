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
exports.BusinessApplication = exports.CriticalityLevel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const business_unit_entity_1 = require("../../common/entities/business-unit.entity");
const information_asset_entity_1 = require("./information-asset.entity");
var CriticalityLevel;
(function (CriticalityLevel) {
    CriticalityLevel["CRITICAL"] = "critical";
    CriticalityLevel["HIGH"] = "high";
    CriticalityLevel["MEDIUM"] = "medium";
    CriticalityLevel["LOW"] = "low";
})(CriticalityLevel || (exports.CriticalityLevel = CriticalityLevel = {}));
let BusinessApplication = class BusinessApplication {
};
exports.BusinessApplication = BusinessApplication;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BusinessApplication.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: false, name: 'unique_identifier' }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: false }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "applicationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "applicationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "versionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "patchLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "businessPurpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], BusinessApplication.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "businessUnitId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_unit_entity_1.BusinessUnit, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'business_unit_id' }),
    __metadata("design:type", business_unit_entity_1.BusinessUnit)
], BusinessApplication.prototype, "businessUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], BusinessApplication.prototype, "dataProcessed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: information_asset_entity_1.ClassificationLevel,
        nullable: true,
    }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "dataClassification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "vendorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], BusinessApplication.prototype, "vendorContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "licenseType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], BusinessApplication.prototype, "licenseCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BusinessApplication.prototype, "licenseExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "hostingType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "hostingLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "accessUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], BusinessApplication.prototype, "securityTestResults", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BusinessApplication.prototype, "lastSecurityTestDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "authenticationMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], BusinessApplication.prototype, "complianceRequirements", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CriticalityLevel,
        nullable: true,
    }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "criticalityLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], BusinessApplication.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BusinessApplication.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], BusinessApplication.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], BusinessApplication.prototype, "updatedByUser", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BusinessApplication.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'deleted_at' }),
    __metadata("design:type", Date)
], BusinessApplication.prototype, "deletedAt", void 0);
exports.BusinessApplication = BusinessApplication = __decorate([
    (0, typeorm_1.Entity)('business_applications'),
    (0, typeorm_1.Index)(['applicationName']),
    (0, typeorm_1.Index)(['applicationType']),
    (0, typeorm_1.Index)(['ownerId']),
    (0, typeorm_1.Index)(['businessUnitId']),
    (0, typeorm_1.Index)(['criticalityLevel']),
    (0, typeorm_1.Index)(['vendorName'])
], BusinessApplication);
//# sourceMappingURL=business-application.entity.js.map