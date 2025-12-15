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
exports.AssetAuditLogQueryDto = exports.AssetAuditLogResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const asset_audit_log_entity_1 = require("../entities/asset-audit-log.entity");
class AssetAuditLogResponseDto {
}
exports.AssetAuditLogResponseDto = AssetAuditLogResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Audit log ID' }),
    __metadata("design:type", String)
], AssetAuditLogResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset type', enum: asset_audit_log_entity_1.AssetType }),
    __metadata("design:type", String)
], AssetAuditLogResponseDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset ID' }),
    __metadata("design:type", String)
], AssetAuditLogResponseDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action performed', enum: asset_audit_log_entity_1.AuditAction }),
    __metadata("design:type", String)
], AssetAuditLogResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field name (for updates)' }),
    __metadata("design:type", String)
], AssetAuditLogResponseDto.prototype, "fieldName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Old value (for updates)' }),
    __metadata("design:type", String)
], AssetAuditLogResponseDto.prototype, "oldValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New value (for updates)' }),
    __metadata("design:type", String)
], AssetAuditLogResponseDto.prototype, "newValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who made the change' }),
    __metadata("design:type", Object)
], AssetAuditLogResponseDto.prototype, "changedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for change' }),
    __metadata("design:type", String)
], AssetAuditLogResponseDto.prototype, "changeReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When the change was made' }),
    __metadata("design:type", Object)
], AssetAuditLogResponseDto.prototype, "createdAt", void 0);
class AssetAuditLogQueryDto {
}
exports.AssetAuditLogQueryDto = AssetAuditLogQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date for filtering', type: String, format: 'date-time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AssetAuditLogQueryDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date for filtering', type: String, format: 'date-time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AssetAuditLogQueryDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssetAuditLogQueryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by action', enum: asset_audit_log_entity_1.AuditAction }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(asset_audit_log_entity_1.AuditAction),
    __metadata("design:type", String)
], AssetAuditLogQueryDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AssetAuditLogQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', example: 50, default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AssetAuditLogQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=asset-audit-log-response.dto.js.map