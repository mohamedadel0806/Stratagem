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
exports.CreateInformationAssetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const information_asset_entity_1 = require("../entities/information-asset.entity");
class CreateInformationAssetDto {
}
exports.CreateInformationAssetDto = CreateInformationAssetDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Unique identifier (auto-generated if not provided)', maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "uniqueIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Information type (VARCHAR 200, REQUIRED)', maxLength: 200 }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "informationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset name (VARCHAR 300, REQUIRED)', maxLength: 300 }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: information_asset_entity_1.ClassificationLevel }),
    (0, class_validator_1.IsEnum)(information_asset_entity_1.ClassificationLevel),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "classificationLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "classificationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "reclassificationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Information owner ID (FK to users)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "informationOwnerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Asset custodian ID (FK to users)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "assetCustodianId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business unit ID (FK to business_units)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "businessUnitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Asset location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "assetLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "storageMedium", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Compliance requirements (JSONB)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInformationAssetDto.prototype, "complianceRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInformationAssetDto.prototype, "retentionPeriod", void 0);
//# sourceMappingURL=create-information-asset.dto.js.map