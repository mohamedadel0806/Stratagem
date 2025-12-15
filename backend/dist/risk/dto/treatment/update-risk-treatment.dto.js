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
exports.UpdateRiskTreatmentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_risk_treatment_dto_1 = require("./create-risk-treatment.dto");
const class_validator_1 = require("class-validator");
class UpdateRiskTreatmentDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(create_risk_treatment_dto_1.CreateRiskTreatmentDto, ['risk_id'])) {
}
exports.UpdateRiskTreatmentDto = UpdateRiskTreatmentDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateRiskTreatmentDto.prototype, "actual_cost", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRiskTreatmentDto.prototype, "actual_completion_date", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateRiskTreatmentDto.prototype, "progress_percentage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRiskTreatmentDto.prototype, "progress_notes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateRiskTreatmentDto.prototype, "attachments", void 0);
//# sourceMappingURL=update-risk-treatment.dto.js.map