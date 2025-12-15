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
exports.AssetDependencyResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const asset_dependency_entity_1 = require("../entities/asset-dependency.entity");
class AssetDependencyResponseDto {
}
exports.AssetDependencyResponseDto = AssetDependencyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dependency ID' }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source asset type', enum: asset_dependency_entity_1.AssetType }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "sourceAssetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source asset ID' }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "sourceAssetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source asset name' }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "sourceAssetName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source asset identifier' }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "sourceAssetIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target asset type', enum: asset_dependency_entity_1.AssetType }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "targetAssetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target asset ID' }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "targetAssetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target asset name' }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "targetAssetName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target asset identifier' }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "targetAssetIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Relationship type', enum: asset_dependency_entity_1.RelationshipType }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "relationshipType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description' }),
    __metadata("design:type", String)
], AssetDependencyResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created at' }),
    __metadata("design:type", Date)
], AssetDependencyResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated at' }),
    __metadata("design:type", Date)
], AssetDependencyResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=asset-dependency-response.dto.js.map