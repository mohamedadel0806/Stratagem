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
exports.CreateRiskAssessmentRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const risk_assessment_entity_1 = require("../../entities/risk-assessment.entity");
const risk_assessment_request_entity_1 = require("../../entities/risk-assessment-request.entity");
class CreateRiskAssessmentRequestDto {
}
exports.CreateRiskAssessmentRequestDto = CreateRiskAssessmentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk ID for which assessment is requested' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskAssessmentRequestDto.prototype, "risk_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID of the person who should perform the assessment', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskAssessmentRequestDto.prototype, "requested_for_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_assessment_entity_1.AssessmentType, description: 'Type of assessment requested' }),
    (0, class_validator_1.IsEnum)(risk_assessment_entity_1.AssessmentType),
    __metadata("design:type", String)
], CreateRiskAssessmentRequestDto.prototype, "assessment_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_assessment_request_entity_1.RequestPriority, default: risk_assessment_request_entity_1.RequestPriority.MEDIUM, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(risk_assessment_request_entity_1.RequestPriority),
    __metadata("design:type", String)
], CreateRiskAssessmentRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Due date for the assessment', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRiskAssessmentRequestDto.prototype, "due_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Justification for why this assessment is needed', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateRiskAssessmentRequestDto.prototype, "justification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateRiskAssessmentRequestDto.prototype, "notes", void 0);
//# sourceMappingURL=create-risk-assessment-request.dto.js.map