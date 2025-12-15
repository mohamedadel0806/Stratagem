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
exports.BulkCreateControlAssetMappingDto = exports.CreateControlAssetMappingDto = void 0;
const class_validator_1 = require("class-validator");
const control_asset_mapping_entity_1 = require("../entities/control-asset-mapping.entity");
const unified_control_entity_1 = require("../entities/unified-control.entity");
class CreateControlAssetMappingDto {
}
exports.CreateControlAssetMappingDto = CreateControlAssetMappingDto;
__decorate([
    (0, class_validator_1.IsEnum)(control_asset_mapping_entity_1.AssetType),
    __metadata("design:type", String)
], CreateControlAssetMappingDto.prototype, "asset_type", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateControlAssetMappingDto.prototype, "asset_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateControlAssetMappingDto.prototype, "implementation_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(unified_control_entity_1.ImplementationStatus),
    __metadata("design:type", String)
], CreateControlAssetMappingDto.prototype, "implementation_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateControlAssetMappingDto.prototype, "implementation_notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateControlAssetMappingDto.prototype, "last_test_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateControlAssetMappingDto.prototype, "last_test_result", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateControlAssetMappingDto.prototype, "effectiveness_score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateControlAssetMappingDto.prototype, "is_automated", void 0);
class BulkCreateControlAssetMappingDto {
}
exports.BulkCreateControlAssetMappingDto = BulkCreateControlAssetMappingDto;
__decorate([
    (0, class_validator_1.IsEnum)(control_asset_mapping_entity_1.AssetType),
    __metadata("design:type", String)
], BulkCreateControlAssetMappingDto.prototype, "asset_type", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], BulkCreateControlAssetMappingDto.prototype, "asset_ids", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkCreateControlAssetMappingDto.prototype, "implementation_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(unified_control_entity_1.ImplementationStatus),
    __metadata("design:type", String)
], BulkCreateControlAssetMappingDto.prototype, "implementation_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkCreateControlAssetMappingDto.prototype, "implementation_notes", void 0);
//# sourceMappingURL=create-control-asset-mapping.dto.js.map