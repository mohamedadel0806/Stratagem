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
exports.PhysicalAssetResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
class PhysicalAssetResponseDto {
}
exports.PhysicalAssetResponseDto = PhysicalAssetResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "assetTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], PhysicalAssetResponseDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "assetDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "businessPurpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], PhysicalAssetResponseDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "businessUnitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], PhysicalAssetResponseDto.prototype, "businessUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "physicalLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: physical_asset_entity_1.CriticalityLevel }),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "criticalityLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], PhysicalAssetResponseDto.prototype, "macAddresses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], PhysicalAssetResponseDto.prototype, "ipAddresses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array, description: 'Installed software (JSONB)' }),
    __metadata("design:type", Array)
], PhysicalAssetResponseDto.prototype, "installedSoftware", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array, description: 'Active ports and services (JSONB)' }),
    __metadata("design:type", Array)
], PhysicalAssetResponseDto.prototype, "activePortsServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: physical_asset_entity_1.NetworkApprovalStatus }),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "networkApprovalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: physical_asset_entity_1.ConnectivityStatus }),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "connectivityStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PhysicalAssetResponseDto.prototype, "lastConnectivityCheck", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "serialNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PhysicalAssetResponseDto.prototype, "assetTag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PhysicalAssetResponseDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PhysicalAssetResponseDto.prototype, "warrantyExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], PhysicalAssetResponseDto.prototype, "complianceRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    __metadata("design:type", Object)
], PhysicalAssetResponseDto.prototype, "securityTestResults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PhysicalAssetResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PhysicalAssetResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PhysicalAssetResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of risks linked to this asset' }),
    __metadata("design:type", Number)
], PhysicalAssetResponseDto.prototype, "riskCount", void 0);
//# sourceMappingURL=physical-asset-response.dto.js.map