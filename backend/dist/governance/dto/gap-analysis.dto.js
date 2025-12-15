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
exports.GapAnalysisQueryDto = exports.GapAnalysisDto = exports.FrameworkGapSummaryDto = exports.RequirementGapDto = exports.GapType = void 0;
const swagger_1 = require("@nestjs/swagger");
var GapType;
(function (GapType) {
    GapType["FRAMEWORK"] = "framework";
    GapType["CONTROL"] = "control";
    GapType["ASSET"] = "asset";
    GapType["EVIDENCE"] = "evidence";
    GapType["ASSESSMENT"] = "assessment";
})(GapType || (exports.GapType = GapType = {}));
class RequirementGapDto {
}
exports.RequirementGapDto = RequirementGapDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "requirementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "requirementIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "requirementText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "frameworkId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "frameworkName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "coverageLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RequirementGapDto.prototype, "mappedControlsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequirementGapDto.prototype, "gapSeverity", void 0);
class FrameworkGapSummaryDto {
}
exports.FrameworkGapSummaryDto = FrameworkGapSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FrameworkGapSummaryDto.prototype, "frameworkId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FrameworkGapSummaryDto.prototype, "frameworkName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkGapSummaryDto.prototype, "totalRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkGapSummaryDto.prototype, "mappedRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkGapSummaryDto.prototype, "unmappedRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkGapSummaryDto.prototype, "partialCoverageRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkGapSummaryDto.prototype, "coveragePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RequirementGapDto] }),
    __metadata("design:type", Array)
], FrameworkGapSummaryDto.prototype, "gaps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkGapSummaryDto.prototype, "criticalGapsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FrameworkGapSummaryDto.prototype, "highPriorityGapsCount", void 0);
class GapAnalysisDto {
}
exports.GapAnalysisDto = GapAnalysisDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], GapAnalysisDto.prototype, "generatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GapAnalysisDto.prototype, "totalFrameworks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GapAnalysisDto.prototype, "totalRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GapAnalysisDto.prototype, "totalMappedRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GapAnalysisDto.prototype, "totalUnmappedRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GapAnalysisDto.prototype, "overallCoveragePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FrameworkGapSummaryDto] }),
    __metadata("design:type", Array)
], GapAnalysisDto.prototype, "frameworks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RequirementGapDto] }),
    __metadata("design:type", Array)
], GapAnalysisDto.prototype, "allGaps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GapAnalysisDto.prototype, "criticalGapsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], GapAnalysisDto.prototype, "recommendations", void 0);
class GapAnalysisQueryDto {
}
exports.GapAnalysisQueryDto = GapAnalysisQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Comma-separated framework IDs' }),
    __metadata("design:type", String)
], GapAnalysisQueryDto.prototype, "frameworkIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: GapType }),
    __metadata("design:type", String)
], GapAnalysisQueryDto.prototype, "gapType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filter by domain' }),
    __metadata("design:type", String)
], GapAnalysisQueryDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filter by category' }),
    __metadata("design:type", String)
], GapAnalysisQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Include only critical/high priority gaps' }),
    __metadata("design:type", Boolean)
], GapAnalysisQueryDto.prototype, "priorityOnly", void 0);
//# sourceMappingURL=gap-analysis.dto.js.map