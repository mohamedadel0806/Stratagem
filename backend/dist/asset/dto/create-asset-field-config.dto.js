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
exports.CreateAssetFieldConfigDto = void 0;
const class_validator_1 = require("class-validator");
const asset_field_config_entity_1 = require("../entities/asset-field-config.entity");
class CreateAssetFieldConfigDto {
}
exports.CreateAssetFieldConfigDto = CreateAssetFieldConfigDto;
__decorate([
    (0, class_validator_1.IsEnum)(asset_field_config_entity_1.AssetTypeEnum),
    __metadata("design:type", String)
], CreateAssetFieldConfigDto.prototype, "assetType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetFieldConfigDto.prototype, "fieldName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetFieldConfigDto.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(asset_field_config_entity_1.FieldType),
    __metadata("design:type", String)
], CreateAssetFieldConfigDto.prototype, "fieldType", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateAssetFieldConfigDto.prototype, "isRequired", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateAssetFieldConfigDto.prototype, "isEnabled", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAssetFieldConfigDto.prototype, "displayOrder", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssetFieldConfigDto.prototype, "validationRule", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssetFieldConfigDto.prototype, "validationMessage", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAssetFieldConfigDto.prototype, "selectOptions", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssetFieldConfigDto.prototype, "defaultValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssetFieldConfigDto.prototype, "helpText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAssetFieldConfigDto.prototype, "fieldDependencies", void 0);
//# sourceMappingURL=create-asset-field-config.dto.js.map