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
exports.AssessAssetRequestDto = exports.BulkAssessRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BulkAssessRequestDto {
}
exports.BulkAssessRequestDto = BulkAssessRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['physical', 'information', 'application', 'software', 'supplier'] }),
    (0, class_validator_1.IsEnum)(['physical', 'information', 'application', 'software', 'supplier']),
    __metadata("design:type", String)
], BulkAssessRequestDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Array of asset IDs to assess' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], BulkAssessRequestDto.prototype, "assetIds", void 0);
class AssessAssetRequestDto {
}
exports.AssessAssetRequestDto = AssessAssetRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['physical', 'information', 'application', 'software', 'supplier'] }),
    (0, class_validator_1.IsEnum)(['physical', 'information', 'application', 'software', 'supplier']),
    __metadata("design:type", String)
], AssessAssetRequestDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssessAssetRequestDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specific requirement ID to assess (optional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssessAssetRequestDto.prototype, "requirementId", void 0);
//# sourceMappingURL=assessment-request.dto.js.map