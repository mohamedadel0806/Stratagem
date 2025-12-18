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
exports.InformationAssetQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const information_asset_entity_1 = require("../entities/information-asset.entity");
class InformationAssetQueryDto {
}
exports.InformationAssetQueryDto = InformationAssetQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InformationAssetQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: information_asset_entity_1.ClassificationLevel, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(information_asset_entity_1.ClassificationLevel),
    __metadata("design:type", String)
], InformationAssetQueryDto.prototype, "dataClassification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filter by compliance requirement (e.g., ISO 27001, SOC 2)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InformationAssetQueryDto.prototype, "complianceRequirement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Business unit ID (UUID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InformationAssetQueryDto.prototype, "businessUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Information owner ID (UUID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InformationAssetQueryDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], InformationAssetQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], InformationAssetQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=information-asset-query.dto.js.map