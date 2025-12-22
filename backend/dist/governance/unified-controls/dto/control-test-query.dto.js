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
exports.ControlTestQueryDto = void 0;
const class_validator_1 = require("class-validator");
const control_test_entity_1 = require("../entities/control-test.entity");
class ControlTestQueryDto {
}
exports.ControlTestQueryDto = ControlTestQueryDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ControlTestQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ControlTestQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ControlTestQueryDto.prototype, "unified_control_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ControlTestQueryDto.prototype, "tester_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(control_test_entity_1.ControlTestType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ControlTestQueryDto.prototype, "test_type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(control_test_entity_1.ControlTestStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ControlTestQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(control_test_entity_1.ControlTestResult),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ControlTestQueryDto.prototype, "result", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ControlTestQueryDto.prototype, "search", void 0);
//# sourceMappingURL=control-test-query.dto.js.map