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
exports.GovernanceTrendResponseDto = exports.GovernanceForecastPointDto = exports.GovernanceTrendPointDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GovernanceTrendPointDto {
}
exports.GovernanceTrendPointDto = GovernanceTrendPointDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-01' }),
    __metadata("design:type", String)
], GovernanceTrendPointDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Overall compliance percentage for the day' }),
    __metadata("design:type", Number)
], GovernanceTrendPointDto.prototype, "complianceRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of controls implemented as of the day' }),
    __metadata("design:type", Number)
], GovernanceTrendPointDto.prototype, "implementedControls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total controls in scope as of the day' }),
    __metadata("design:type", Number)
], GovernanceTrendPointDto.prototype, "totalControls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Open findings count as of the day' }),
    __metadata("design:type", Number)
], GovernanceTrendPointDto.prototype, "openFindings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assessment completion percentage for the day' }),
    __metadata("design:type", Number)
], GovernanceTrendPointDto.prototype, "assessmentCompletionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk closure rate percentage for the day' }),
    __metadata("design:type", Number)
], GovernanceTrendPointDto.prototype, "riskClosureRate", void 0);
class GovernanceForecastPointDto {
}
exports.GovernanceForecastPointDto = GovernanceForecastPointDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-15' }),
    __metadata("design:type", String)
], GovernanceForecastPointDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Projected compliance percentage' }),
    __metadata("design:type", Number)
], GovernanceForecastPointDto.prototype, "projectedComplianceRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Projected open findings count' }),
    __metadata("design:type", Number)
], GovernanceForecastPointDto.prototype, "projectedOpenFindings", void 0);
class GovernanceTrendResponseDto {
}
exports.GovernanceTrendResponseDto = GovernanceTrendResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [GovernanceTrendPointDto] }),
    __metadata("design:type", Array)
], GovernanceTrendResponseDto.prototype, "history", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [GovernanceForecastPointDto] }),
    __metadata("design:type", Array)
], GovernanceTrendResponseDto.prototype, "forecast", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: GovernanceTrendPointDto }),
    __metadata("design:type", GovernanceTrendPointDto)
], GovernanceTrendResponseDto.prototype, "latestSnapshot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-04T08:00:00.000Z' }),
    __metadata("design:type", String)
], GovernanceTrendResponseDto.prototype, "lastUpdatedAt", void 0);
//# sourceMappingURL=governance-trend.dto.js.map