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
exports.CreateAssetDependencyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const asset_dependency_entity_1 = require("../entities/asset-dependency.entity");
class CreateAssetDependencyDto {
}
exports.CreateAssetDependencyDto = CreateAssetDependencyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target asset type',
        enum: asset_dependency_entity_1.AssetType,
        example: asset_dependency_entity_1.AssetType.PHYSICAL,
    }),
    (0, class_validator_1.IsEnum)(asset_dependency_entity_1.AssetType),
    __metadata("design:type", String)
], CreateAssetDependencyDto.prototype, "targetAssetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target asset ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetDependencyDto.prototype, "targetAssetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Relationship type',
        enum: asset_dependency_entity_1.RelationshipType,
        example: asset_dependency_entity_1.RelationshipType.DEPENDS_ON,
        default: asset_dependency_entity_1.RelationshipType.DEPENDS_ON,
    }),
    (0, class_validator_1.IsEnum)(asset_dependency_entity_1.RelationshipType),
    __metadata("design:type", String)
], CreateAssetDependencyDto.prototype, "relationshipType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the dependency',
        example: 'Application depends on this database server',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetDependencyDto.prototype, "description", void 0);
//# sourceMappingURL=create-asset-dependency.dto.js.map