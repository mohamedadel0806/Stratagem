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
exports.GlobalAssetSearchResponseDto = exports.GlobalAssetSearchResultDto = exports.GlobalAssetSearchQueryDto = exports.AssetType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var AssetType;
(function (AssetType) {
    AssetType["PHYSICAL"] = "physical";
    AssetType["INFORMATION"] = "information";
    AssetType["APPLICATION"] = "application";
    AssetType["SOFTWARE"] = "software";
    AssetType["SUPPLIER"] = "supplier";
    AssetType["ALL"] = "all";
})(AssetType || (exports.AssetType = AssetType = {}));
class GlobalAssetSearchQueryDto {
}
exports.GlobalAssetSearchQueryDto = GlobalAssetSearchQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search query string', example: 'server' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GlobalAssetSearchQueryDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by asset type',
        enum: AssetType,
        example: AssetType.ALL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AssetType),
    __metadata("design:type", String)
], GlobalAssetSearchQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GlobalAssetSearchQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', example: 20, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GlobalAssetSearchQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by criticality level', example: 'high' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GlobalAssetSearchQueryDto.prototype, "criticality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by business unit', example: 'IT Department' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GlobalAssetSearchQueryDto.prototype, "businessUnit", void 0);
class GlobalAssetSearchResultDto {
}
exports.GlobalAssetSearchResultDto = GlobalAssetSearchResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset ID' }),
    __metadata("design:type", String)
], GlobalAssetSearchResultDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset type', enum: AssetType }),
    __metadata("design:type", String)
], GlobalAssetSearchResultDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset name/description' }),
    __metadata("design:type", String)
], GlobalAssetSearchResultDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset identifier' }),
    __metadata("design:type", String)
], GlobalAssetSearchResultDto.prototype, "identifier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Criticality level' }),
    __metadata("design:type", String)
], GlobalAssetSearchResultDto.prototype, "criticality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Owner name' }),
    __metadata("design:type", String)
], GlobalAssetSearchResultDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business unit' }),
    __metadata("design:type", String)
], GlobalAssetSearchResultDto.prototype, "businessUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created at' }),
    __metadata("design:type", Date)
], GlobalAssetSearchResultDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated at' }),
    __metadata("design:type", Date)
], GlobalAssetSearchResultDto.prototype, "updatedAt", void 0);
class GlobalAssetSearchResponseDto {
}
exports.GlobalAssetSearchResponseDto = GlobalAssetSearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search results', type: [GlobalAssetSearchResultDto] }),
    __metadata("design:type", Array)
], GlobalAssetSearchResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of results' }),
    __metadata("design:type", Number)
], GlobalAssetSearchResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], GlobalAssetSearchResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], GlobalAssetSearchResponseDto.prototype, "limit", void 0);
//# sourceMappingURL=global-asset-search.dto.js.map