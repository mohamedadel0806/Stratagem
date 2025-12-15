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
exports.UpdateRiskFindingLinkDto = exports.CreateRiskFindingLinkDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const risk_finding_link_entity_1 = require("../../entities/risk-finding-link.entity");
class CreateRiskFindingLinkDto {
}
exports.CreateRiskFindingLinkDto = CreateRiskFindingLinkDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskFindingLinkDto.prototype, "risk_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Finding ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskFindingLinkDto.prototype, "finding_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'How the finding relates to the risk',
        enum: risk_finding_link_entity_1.RiskFindingRelationshipType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(risk_finding_link_entity_1.RiskFindingRelationshipType),
    __metadata("design:type", String)
], CreateRiskFindingLinkDto.prototype, "relationship_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes about the relationship' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskFindingLinkDto.prototype, "notes", void 0);
class UpdateRiskFindingLinkDto {
}
exports.UpdateRiskFindingLinkDto = UpdateRiskFindingLinkDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'How the finding relates to the risk',
        enum: risk_finding_link_entity_1.RiskFindingRelationshipType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(risk_finding_link_entity_1.RiskFindingRelationshipType),
    __metadata("design:type", String)
], UpdateRiskFindingLinkDto.prototype, "relationship_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes about the relationship' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiskFindingLinkDto.prototype, "notes", void 0);
//# sourceMappingURL=create-risk-finding-link.dto.js.map