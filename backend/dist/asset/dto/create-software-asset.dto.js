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
exports.CreateSoftwareAssetDto = exports.KnownVulnerabilityDto = exports.SecurityTestResultsDto = exports.VendorContactDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class VendorContactDto {
}
exports.VendorContactDto = VendorContactDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VendorContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VendorContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VendorContactDto.prototype, "phone", void 0);
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
class KnownVulnerabilityDto {
}
exports.KnownVulnerabilityDto = KnownVulnerabilityDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], KnownVulnerabilityDto.prototype, "cve_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], KnownVulnerabilityDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], KnownVulnerabilityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], KnownVulnerabilityDto.prototype, "patch_available", void 0);
class CreateSoftwareAssetDto {
}
exports.CreateSoftwareAssetDto = CreateSoftwareAssetDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Unique identifier (auto-generated if not provided)', maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Software name (VARCHAR 300, REQUIRED)', maxLength: 300 }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "softwareName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "softwareType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "versionNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "patchLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business purpose' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "businessPurpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business unit ID (FK to business_units)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "businessUnitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "vendorName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: VendorContactDto, description: 'Vendor contact (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VendorContactDto),
    __metadata("design:type", VendorContactDto)
], CreateSoftwareAssetDto.prototype, "vendorContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "licenseType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSoftwareAssetDto.prototype, "licenseCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'License key (encrypted)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "licenseKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSoftwareAssetDto.prototype, "installationCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SecurityTestResultsDto, description: 'Security test results (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SecurityTestResultsDto),
    __metadata("design:type", SecurityTestResultsDto)
], CreateSoftwareAssetDto.prototype, "securityTestResults", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "lastSecurityTestDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [KnownVulnerabilityDto], description: 'Known vulnerabilities (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => KnownVulnerabilityDto),
    __metadata("design:type", Array)
], CreateSoftwareAssetDto.prototype, "knownVulnerabilities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSoftwareAssetDto.prototype, "supportEndDate", void 0);
//# sourceMappingURL=create-software-asset.dto.js.map