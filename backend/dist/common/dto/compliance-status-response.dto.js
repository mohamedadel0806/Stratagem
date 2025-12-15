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
exports.ComplianceStatusResponseDto = exports.FrameworkStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FrameworkStatusDto {
}
exports.FrameworkStatusDto = FrameworkStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FrameworkStatusDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkStatusDto.prototype, "compliancePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkStatusDto.prototype, "requirementsMet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkStatusDto.prototype, "totalRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['improving', 'stable', 'declining'] }),
    __metadata("design:type", String)
], FrameworkStatusDto.prototype, "trend", void 0);
class ComplianceStatusResponseDto {
}
exports.ComplianceStatusResponseDto = ComplianceStatusResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ComplianceStatusResponseDto.prototype, "overallCompliance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FrameworkStatusDto] }),
    __metadata("design:type", Array)
], ComplianceStatusResponseDto.prototype, "frameworks", void 0);
//# sourceMappingURL=compliance-status-response.dto.js.map