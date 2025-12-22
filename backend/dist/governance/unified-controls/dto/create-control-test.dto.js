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
exports.CreateControlTestDto = void 0;
const class_validator_1 = require("class-validator");
const control_test_entity_1 = require("../entities/control-test.entity");
class CreateControlTestDto {
}
exports.CreateControlTestDto = CreateControlTestDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "unified_control_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "control_asset_mapping_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(control_test_entity_1.ControlTestType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "test_type", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "test_date", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(control_test_entity_1.ControlTestStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(control_test_entity_1.ControlTestResult),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "result", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateControlTestDto.prototype, "effectiveness_score", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "test_procedure", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "observations", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "recommendations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateControlTestDto.prototype, "evidence_links", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateControlTestDto.prototype, "tester_id", void 0);
//# sourceMappingURL=create-control-test.dto.js.map