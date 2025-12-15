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
exports.PhysicalAsset = exports.NetworkApprovalStatus = exports.ConnectivityStatus = exports.CriticalityLevel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const asset_type_entity_1 = require("./asset-type.entity");
const business_unit_entity_1 = require("../../common/entities/business-unit.entity");
var CriticalityLevel;
(function (CriticalityLevel) {
    CriticalityLevel["CRITICAL"] = "critical";
    CriticalityLevel["HIGH"] = "high";
    CriticalityLevel["MEDIUM"] = "medium";
    CriticalityLevel["LOW"] = "low";
})(CriticalityLevel || (exports.CriticalityLevel = CriticalityLevel = {}));
var ConnectivityStatus;
(function (ConnectivityStatus) {
    ConnectivityStatus["CONNECTED"] = "connected";
    ConnectivityStatus["DISCONNECTED"] = "disconnected";
    ConnectivityStatus["UNKNOWN"] = "unknown";
})(ConnectivityStatus || (exports.ConnectivityStatus = ConnectivityStatus = {}));
var NetworkApprovalStatus;
(function (NetworkApprovalStatus) {
    NetworkApprovalStatus["APPROVED"] = "approved";
    NetworkApprovalStatus["PENDING"] = "pending";
    NetworkApprovalStatus["REJECTED"] = "rejected";
    NetworkApprovalStatus["NOT_REQUIRED"] = "not_required";
})(NetworkApprovalStatus || (exports.NetworkApprovalStatus = NetworkApprovalStatus = {}));
let PhysicalAsset = class PhysicalAsset {
};
exports.PhysicalAsset = PhysicalAsset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "assetTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_type_entity_1.AssetType, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_type_id' }),
    __metadata("design:type", asset_type_entity_1.AssetType)
], PhysicalAsset.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "assetDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "manufacturer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "businessPurpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], PhysicalAsset.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "businessUnitId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_unit_entity_1.BusinessUnit, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'business_unit_id' }),
    __metadata("design:type", business_unit_entity_1.BusinessUnit)
], PhysicalAsset.prototype, "businessUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, unique: true, nullable: false }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "physicalLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CriticalityLevel,
        nullable: true,
    }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "criticalityLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PhysicalAsset.prototype, "macAddresses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PhysicalAsset.prototype, "ipAddresses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PhysicalAsset.prototype, "installedSoftware", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PhysicalAsset.prototype, "activePortsServices", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NetworkApprovalStatus,
        default: NetworkApprovalStatus.PENDING,
    }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "networkApprovalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConnectivityStatus,
        default: ConnectivityStatus.UNKNOWN,
    }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "connectivityStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PhysicalAsset.prototype, "lastConnectivityCheck", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "assetTag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PhysicalAsset.prototype, "purchaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PhysicalAsset.prototype, "warrantyExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PhysicalAsset.prototype, "complianceRequirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], PhysicalAsset.prototype, "securityTestResults", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], PhysicalAsset.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PhysicalAsset.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PhysicalAsset.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], PhysicalAsset.prototype, "updatedByUser", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PhysicalAsset.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PhysicalAsset.prototype, "deletedAt", void 0);
exports.PhysicalAsset = PhysicalAsset = __decorate([
    (0, typeorm_1.Entity)('physical_assets'),
    (0, typeorm_1.Index)(['uniqueIdentifier'], { unique: true }),
    (0, typeorm_1.Index)(['ownerId']),
    (0, typeorm_1.Index)(['businessUnitId']),
    (0, typeorm_1.Index)(['assetTypeId']),
    (0, typeorm_1.Index)(['criticalityLevel']),
    (0, typeorm_1.Index)(['physicalLocation']),
    (0, typeorm_1.Index)(['connectivityStatus'])
], PhysicalAsset);
//# sourceMappingURL=physical-asset.entity.js.map