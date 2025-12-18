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
exports.CreateSOPDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const sop_entity_1 = require("../entities/sop.entity");
class CreateSOPDto {
}
exports.CreateSOPDto = CreateSOPDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the SOP', example: 'SOP-USER-PROV-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "sop_identifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the SOP', example: 'User Provisioning Procedure' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: sop_entity_1.SOPCategory, description: 'Category of the SOP' }),
    (0, class_validator_1.IsEnum)(sop_entity_1.SOPCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Subcategory of the SOP' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "subcategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Purpose of the SOP' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scope of the SOP' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Full content of the SOP document' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Version of the SOP', example: '1.0' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: sop_entity_1.SOPStatus, default: sop_entity_1.SOPStatus.DRAFT }),
    (0, class_validator_1.IsEnum)(sop_entity_1.SOPStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the SOP owner' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "owner_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Review frequency', example: 'annual' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "review_frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next review date', example: '2025-12-31' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSOPDto.prototype, "next_review_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of policy IDs to link', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSOPDto.prototype, "linked_policies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of standard IDs to link', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSOPDto.prototype, "linked_standards", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of control IDs to link', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSOPDto.prototype, "control_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tags for categorization', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSOPDto.prototype, "tags", void 0);
//# sourceMappingURL=create-sop.dto.js.map