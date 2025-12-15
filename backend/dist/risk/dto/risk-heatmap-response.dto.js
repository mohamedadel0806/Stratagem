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
exports.RiskHeatmapResponseDto = exports.RiskHeatmapCellDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RiskHeatmapCellDto {
}
exports.RiskHeatmapCellDto = RiskHeatmapCellDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapCellDto.prototype, "likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapCellDto.prototype, "impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapCellDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapCellDto.prototype, "riskScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], RiskHeatmapCellDto.prototype, "riskIds", void 0);
class RiskHeatmapResponseDto {
}
exports.RiskHeatmapResponseDto = RiskHeatmapResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RiskHeatmapCellDto] }),
    __metadata("design:type", Array)
], RiskHeatmapResponseDto.prototype, "cells", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapResponseDto.prototype, "totalRisks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapResponseDto.prototype, "maxRiskScore", void 0);
//# sourceMappingURL=risk-heatmap-response.dto.js.map