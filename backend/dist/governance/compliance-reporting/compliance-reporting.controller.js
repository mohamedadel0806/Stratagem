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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceReportingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
const compliance_reporting_service_1 = require("./services/compliance-reporting.service");
const compliance_report_dto_1 = require("./dto/compliance-report.dto");
let ComplianceReportingController = class ComplianceReportingController {
    constructor(complianceReportingService) {
        this.complianceReportingService = complianceReportingService;
    }
    async generateReport(createReportDto, req) {
        return this.complianceReportingService.generateComplianceReport(createReportDto, req.user.id);
    }
    async getReport(reportId) {
        return this.complianceReportingService.getReport(reportId);
    }
    async getReports(filterDto) {
        return this.complianceReportingService.getReports(filterDto);
    }
    async getLatestReport() {
        return this.complianceReportingService.getLatestReport();
    }
    async getDashboard() {
        return this.complianceReportingService.getComplianceDashboard();
    }
    async archiveReport(reportId) {
        return this.complianceReportingService.archiveReport(reportId);
    }
};
exports.ComplianceReportingController = ComplianceReportingController;
__decorate([
    (0, common_1.Post)('reports/generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'COMPLIANCE_REPORT'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate comprehensive compliance report' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Compliance report generated successfully',
        type: compliance_report_dto_1.ComplianceReportDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_report_dto_1.CreateComplianceReportDto, Object]),
    __metadata("design:returntype", Promise)
], ComplianceReportingController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('reports/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance report by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance report retrieved successfully',
        type: compliance_report_dto_1.ComplianceReportDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceReportingController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all compliance reports with filtering' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance reports retrieved successfully',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_report_dto_1.ComplianceReportFilterDto]),
    __metadata("design:returntype", Promise)
], ComplianceReportingController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)('reports/latest/current'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest compliance report' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Latest compliance report retrieved',
        type: compliance_report_dto_1.ComplianceReportDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceReportingController.prototype, "getLatestReport", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance dashboard data' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard data retrieved successfully',
        type: compliance_report_dto_1.ComplianceDashboardDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceReportingController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Patch)('reports/:id/archive'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.ARCHIVE, 'COMPLIANCE_REPORT'),
    (0, swagger_1.ApiOperation)({ summary: 'Archive a compliance report' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Report archived successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceReportingController.prototype, "archiveReport", null);
exports.ComplianceReportingController = ComplianceReportingController = __decorate([
    (0, swagger_1.ApiTags)('Compliance Reporting'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('governance/compliance'),
    __metadata("design:paramtypes", [compliance_reporting_service_1.ComplianceReportingService])
], ComplianceReportingController);
//# sourceMappingURL=compliance-reporting.controller.js.map