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
exports.SoftwareAssetResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SoftwareAssetResponseDto {
}
exports.SoftwareAssetResponseDto = SoftwareAssetResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "softwareName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "softwareType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "versionNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "patchLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "businessPurpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SoftwareAssetResponseDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "businessUnitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SoftwareAssetResponseDto.prototype, "businessUnit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "vendorName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    __metadata("design:type", Object)
], SoftwareAssetResponseDto.prototype, "vendorContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "licenseType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], SoftwareAssetResponseDto.prototype, "licenseCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SoftwareAssetResponseDto.prototype, "licenseKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SoftwareAssetResponseDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], SoftwareAssetResponseDto.prototype, "installationCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    __metadata("design:type", Object)
], SoftwareAssetResponseDto.prototype, "securityTestResults", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SoftwareAssetResponseDto.prototype, "lastSecurityTestDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    __metadata("design:type", Array)
], SoftwareAssetResponseDto.prototype, "knownVulnerabilities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SoftwareAssetResponseDto.prototype, "supportEndDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SoftwareAssetResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SoftwareAssetResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SoftwareAssetResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of risks linked to this asset' }),
    __metadata("design:type", Number)
], SoftwareAssetResponseDto.prototype, "riskCount", void 0);
//# sourceMappingURL=software-asset-response.dto.js.map