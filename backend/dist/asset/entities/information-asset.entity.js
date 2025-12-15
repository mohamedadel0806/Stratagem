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
exports.InformationAsset = exports.ClassificationLevel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const business_unit_entity_1 = require("../../common/entities/business-unit.entity");
var ClassificationLevel;
(function (ClassificationLevel) {
    ClassificationLevel["PUBLIC"] = "public";
    ClassificationLevel["INTERNAL"] = "internal";
    ClassificationLevel["CONFIDENTIAL"] = "confidential";
    ClassificationLevel["RESTRICTED"] = "restricted";
    ClassificationLevel["SECRET"] = "secret";
})(ClassificationLevel || (exports.ClassificationLevel = ClassificationLevel = {}));
let InformationAsset = class InformationAsset {
};
exports.InformationAsset = InformationAsset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], InformationAsset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: false, name: 'unique_identifier' }),
    __metadata("design:type", String)
], InformationAsset.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], InformationAsset.prototype, "informationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: false }),
    __metadata("design:type", String)
], InformationAsset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InformationAsset.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ClassificationLevel,
        nullable: false,
    }),
    __metadata("design:type", String)
], InformationAsset.prototype, "classificationLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], InformationAsset.prototype, "classificationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], InformationAsset.prototype, "reclassificationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], InformationAsset.prototype, "reclassificationReminderSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], InformationAsset.prototype, "informationOwnerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'information_owner_id' }),
    __metadata("design:type", user_entity_1.User)
], InformationAsset.prototype, "informationOwner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], InformationAsset.prototype, "assetCustodianId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_custodian_id' }),
    __metadata("design:type", user_entity_1.User)
], InformationAsset.prototype, "assetCustodian", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], InformationAsset.prototype, "businessUnitId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_unit_entity_1.BusinessUnit, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'business_unit_id' }),
    __metadata("design:type", business_unit_entity_1.BusinessUnit)
], InformationAsset.prototype, "businessUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InformationAsset.prototype, "assetLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], InformationAsset.prototype, "storageMedium", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], InformationAsset.prototype, "complianceRequirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], InformationAsset.prototype, "retentionPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], InformationAsset.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], InformationAsset.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], InformationAsset.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], InformationAsset.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], InformationAsset.prototype, "updatedByUser", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], InformationAsset.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'deleted_at' }),
    __metadata("design:type", Date)
], InformationAsset.prototype, "deletedAt", void 0);
exports.InformationAsset = InformationAsset = __decorate([
    (0, typeorm_1.Entity)('information_assets'),
    (0, typeorm_1.Index)(['informationType']),
    (0, typeorm_1.Index)(['classificationLevel']),
    (0, typeorm_1.Index)(['informationOwnerId']),
    (0, typeorm_1.Index)(['assetCustodianId']),
    (0, typeorm_1.Index)(['businessUnitId']),
    (0, typeorm_1.Index)(['reclassificationDate'], { where: 'reclassification_date IS NOT NULL' })
], InformationAsset);
//# sourceMappingURL=information-asset.entity.js.map