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
exports.BusinessApplicationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const business_application_entity_1 = require("../entities/business-application.entity");
const information_asset_entity_1 = require("../entities/information-asset.entity");
class BusinessApplicationResponseDto {
}
exports.BusinessApplicationResponseDto = BusinessApplicationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "applicationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "applicationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "versionNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "patchLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "businessPurpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], BusinessApplicationResponseDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "businessUnitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], BusinessApplicationResponseDto.prototype, "businessUnit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], BusinessApplicationResponseDto.prototype, "dataProcessed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: information_asset_entity_1.ClassificationLevel }),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "dataClassification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "vendorName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    __metadata("design:type", Object)
], BusinessApplicationResponseDto.prototype, "vendorContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "licenseType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], BusinessApplicationResponseDto.prototype, "licenseCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], BusinessApplicationResponseDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "hostingType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "hostingLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "accessUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    __metadata("design:type", Object)
], BusinessApplicationResponseDto.prototype, "securityTestResults", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], BusinessApplicationResponseDto.prototype, "lastSecurityTestDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "authenticationMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], BusinessApplicationResponseDto.prototype, "complianceRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: business_application_entity_1.CriticalityLevel }),
    __metadata("design:type", String)
], BusinessApplicationResponseDto.prototype, "criticalityLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], BusinessApplicationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], BusinessApplicationResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], BusinessApplicationResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of risks linked to this asset' }),
    __metadata("design:type", Number)
], BusinessApplicationResponseDto.prototype, "riskCount", void 0);
//# sourceMappingURL=business-application-response.dto.js.map