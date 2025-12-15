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
exports.CreateBusinessApplicationDto = exports.SecurityTestResultsDto = exports.VendorContactDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const business_application_entity_1 = require("../entities/business-application.entity");
const information_asset_entity_1 = require("../entities/information-asset.entity");
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
class CreateBusinessApplicationDto {
}
exports.CreateBusinessApplicationDto = CreateBusinessApplicationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Unique identifier (auto-generated if not provided)', maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application name (VARCHAR 300, REQUIRED)', maxLength: 300 }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "applicationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "applicationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "versionNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "patchLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business purpose' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "businessPurpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business unit ID (FK to business_units)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "businessUnitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Data processed (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBusinessApplicationDto.prototype, "dataProcessed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: information_asset_entity_1.ClassificationLevel }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(information_asset_entity_1.ClassificationLevel),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "dataClassification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "vendorName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: VendorContactDto, description: 'Vendor contact (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VendorContactDto),
    __metadata("design:type", VendorContactDto)
], CreateBusinessApplicationDto.prototype, "vendorContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "licenseType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateBusinessApplicationDto.prototype, "licenseCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "hostingType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Hosting location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "hostingLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Access URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "accessUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SecurityTestResultsDto, description: 'Security test results (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SecurityTestResultsDto),
    __metadata("design:type", SecurityTestResultsDto)
], CreateBusinessApplicationDto.prototype, "securityTestResults", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "lastSecurityTestDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "authenticationMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Compliance requirements (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBusinessApplicationDto.prototype, "complianceRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: business_application_entity_1.CriticalityLevel }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(business_application_entity_1.CriticalityLevel),
    __metadata("design:type", String)
], CreateBusinessApplicationDto.prototype, "criticalityLevel", void 0);
//# sourceMappingURL=create-business-application.dto.js.map