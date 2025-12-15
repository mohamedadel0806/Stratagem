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
exports.CreatePhysicalAssetDto = exports.SecurityTestResultsDto = exports.ActivePortsServicesDto = exports.InstalledSoftwareDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
class InstalledSoftwareDto {
}
exports.InstalledSoftwareDto = InstalledSoftwareDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InstalledSoftwareDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InstalledSoftwareDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InstalledSoftwareDto.prototype, "patch_level", void 0);
class ActivePortsServicesDto {
}
exports.ActivePortsServicesDto = ActivePortsServicesDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ActivePortsServicesDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ActivePortsServicesDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ActivePortsServicesDto.prototype, "protocol", void 0);
class SecurityTestResultsDto {
}
exports.SecurityTestResultsDto = SecurityTestResultsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecurityTestResultsDto.prototype, "last_test_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecurityTestResultsDto.prototype, "findings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecurityTestResultsDto.prototype, "severity", void 0);
class CreatePhysicalAssetDto {
}
exports.CreatePhysicalAssetDto = CreatePhysicalAssetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset type ID (FK to asset_types)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "assetTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset description (VARCHAR 200, REQUIRED)', maxLength: 200 }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "assetDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business purpose' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "businessPurpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business unit ID (FK to business_units)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "businessUnitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier (VARCHAR 200, REQUIRED, UNIQUE)', maxLength: 200 }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Physical location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "physicalLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: physical_asset_entity_1.CriticalityLevel }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(physical_asset_entity_1.CriticalityLevel),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "criticalityLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Array of MAC addresses (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePhysicalAssetDto.prototype, "macAddresses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Array of IP addresses (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePhysicalAssetDto.prototype, "ipAddresses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [InstalledSoftwareDto], description: 'Installed software (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InstalledSoftwareDto),
    __metadata("design:type", Array)
], CreatePhysicalAssetDto.prototype, "installedSoftware", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ActivePortsServicesDto], description: 'Active ports and services (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ActivePortsServicesDto),
    __metadata("design:type", Array)
], CreatePhysicalAssetDto.prototype, "activePortsServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: physical_asset_entity_1.NetworkApprovalStatus, default: physical_asset_entity_1.NetworkApprovalStatus.PENDING }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(physical_asset_entity_1.NetworkApprovalStatus),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "networkApprovalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: physical_asset_entity_1.ConnectivityStatus, default: physical_asset_entity_1.ConnectivityStatus.UNKNOWN }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(physical_asset_entity_1.ConnectivityStatus),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "connectivityStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "lastConnectivityCheck", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "serialNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "assetTag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePhysicalAssetDto.prototype, "warrantyExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Compliance requirements (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePhysicalAssetDto.prototype, "complianceRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SecurityTestResultsDto, description: 'Security test results (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SecurityTestResultsDto),
    __metadata("design:type", SecurityTestResultsDto)
], CreatePhysicalAssetDto.prototype, "securityTestResults", void 0);
//# sourceMappingURL=create-physical-asset.dto.js.map