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
exports.ReportQueryDto = exports.ExportFormat = exports.ReportType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ReportType;
(function (ReportType) {
    ReportType["POLICY_COMPLIANCE"] = "policy_compliance";
    ReportType["INFLUENCER"] = "influencer";
    ReportType["CONTROL_IMPLEMENTATION"] = "control_implementation";
    ReportType["ASSESSMENT"] = "assessment";
    ReportType["FINDINGS"] = "findings";
    ReportType["CONTROL_STATUS"] = "control_status";
})(ReportType || (exports.ReportType = ReportType = {}));
var ExportFormat;
(function (ExportFormat) {
    ExportFormat["CSV"] = "csv";
    ExportFormat["EXCEL"] = "xlsx";
    ExportFormat["PDF"] = "pdf";
})(ExportFormat || (exports.ExportFormat = ExportFormat = {}));
class ReportQueryDto {
    constructor() {
        this.format = ExportFormat.CSV;
    }
}
exports.ReportQueryDto = ReportQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReportType, description: 'Type of report to generate' }),
    (0, class_validator_1.IsEnum)(ReportType),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExportFormat, description: 'Export format', default: ExportFormat.CSV }),
    (0, class_validator_1.IsEnum)(ExportFormat),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Start date for date range filter' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'End date for date range filter' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Status filter' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Additional filters as JSON string' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "filters", void 0);
//# sourceMappingURL=report-query.dto.js.map