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
exports.DepartmentComplianceDto = exports.ComplianceTrendDto = exports.ComplianceDashboardDto = exports.ComplianceReportDto = exports.ComplianceReportFilterDto = exports.CreateComplianceReportDto = void 0;
const class_validator_1 = require("class-validator");
const compliance_report_entity_1 = require("../entities/compliance-report.entity");
class CreateComplianceReportDto {
}
exports.CreateComplianceReportDto = CreateComplianceReportDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceReportDto.prototype, "report_name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(compliance_report_entity_1.ReportPeriod),
    __metadata("design:type", String)
], CreateComplianceReportDto.prototype, "report_period", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateComplianceReportDto.prototype, "period_start_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateComplianceReportDto.prototype, "period_end_date", void 0);
class ComplianceReportFilterDto {
}
exports.ComplianceReportFilterDto = ComplianceReportFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(compliance_report_entity_1.ReportPeriod),
    __metadata("design:type", String)
], ComplianceReportFilterDto.prototype, "report_period", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComplianceReportFilterDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComplianceReportFilterDto.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(compliance_report_entity_1.ComplianceScore),
    __metadata("design:type", String)
], ComplianceReportFilterDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ComplianceReportFilterDto.prototype, "skip", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ComplianceReportFilterDto.prototype, "take", void 0);
class ComplianceReportDto {
}
exports.ComplianceReportDto = ComplianceReportDto;
class ComplianceDashboardDto {
}
exports.ComplianceDashboardDto = ComplianceDashboardDto;
class ComplianceTrendDto {
}
exports.ComplianceTrendDto = ComplianceTrendDto;
class DepartmentComplianceDto {
}
exports.DepartmentComplianceDto = DepartmentComplianceDto;
//# sourceMappingURL=compliance-report.dto.js.map