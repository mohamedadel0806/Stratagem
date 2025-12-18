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
exports.GovernanceReportingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const governance_reporting_service_1 = require("../services/governance-reporting.service");
const gap_analysis_service_1 = require("../services/gap-analysis.service");
const report_query_dto_1 = require("../dto/report-query.dto");
const gap_analysis_dto_1 = require("../dto/gap-analysis.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let GovernanceReportingController = class GovernanceReportingController {
    constructor(reportingService, gapAnalysisService) {
        this.reportingService = reportingService;
        this.gapAnalysisService = gapAnalysisService;
    }
    async exportReport(query, res) {
        const report = await this.reportingService.generateReport(query);
        res.setHeader('Content-Type', report.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
        res.send(report.data);
    }
    async getPolicyComplianceReport(query, res) {
        try {
            const report = await this.reportingService.generateReport({
                type: report_query_dto_1.ReportType.POLICY_COMPLIANCE,
                format: query.format || report_query_dto_1.ExportFormat.CSV,
                startDate: query.startDate,
                endDate: query.endDate,
                status: query.status,
            });
            res.setHeader('Content-Type', report.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
            res.send(report.data);
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Failed to generate report';
            const errorReport = this.reportingService.generateErrorCsv(`Failed to generate policy compliance report: ${errorMessage}`, 'policy_compliance_report');
            res.setHeader('Content-Type', errorReport.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
            res.status(200).send(errorReport.data);
        }
    }
    async getInfluencerReport(query, res) {
        try {
            const report = await this.reportingService.generateReport({
                type: report_query_dto_1.ReportType.INFLUENCER,
                format: query.format || report_query_dto_1.ExportFormat.CSV,
                startDate: query.startDate,
                endDate: query.endDate,
                status: query.status,
            });
            res.setHeader('Content-Type', report.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
            res.send(report.data);
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Failed to generate report';
            const errorReport = this.reportingService.generateErrorCsv(`Failed to generate influencer report: ${errorMessage}`, 'influencer_report');
            res.setHeader('Content-Type', errorReport.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
            res.status(200).send(errorReport.data);
        }
    }
    async getControlImplementationReport(query, res) {
        try {
            const report = await this.reportingService.generateReport({
                type: report_query_dto_1.ReportType.CONTROL_IMPLEMENTATION,
                format: query.format || report_query_dto_1.ExportFormat.CSV,
                status: query.status,
            });
            res.setHeader('Content-Type', report.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
            res.send(report.data);
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Failed to generate report';
            const errorReport = this.reportingService.generateErrorCsv(`Failed to generate control implementation report: ${errorMessage}`, 'control_implementation_report');
            res.setHeader('Content-Type', errorReport.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
            res.status(200).send(errorReport.data);
        }
    }
    async getAssessmentReport(query, res) {
        try {
            const report = await this.reportingService.generateReport({
                type: report_query_dto_1.ReportType.ASSESSMENT,
                format: query.format || report_query_dto_1.ExportFormat.CSV,
                startDate: query.startDate,
                endDate: query.endDate,
                status: query.status,
            });
            res.setHeader('Content-Type', report.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
            res.send(report.data);
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Failed to generate report';
            const errorReport = this.reportingService.generateErrorCsv(`Failed to generate assessment report: ${errorMessage}`, 'assessment_report');
            res.setHeader('Content-Type', errorReport.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
            res.status(200).send(errorReport.data);
        }
    }
    async getFindingsReport(query, res) {
        try {
            const report = await this.reportingService.generateReport({
                type: report_query_dto_1.ReportType.FINDINGS,
                format: query.format || report_query_dto_1.ExportFormat.CSV,
                startDate: query.startDate,
                endDate: query.endDate,
                status: query.status,
            });
            res.setHeader('Content-Type', report.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
            res.send(report.data);
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Failed to generate report';
            const errorReport = this.reportingService.generateErrorCsv(`Failed to generate findings report: ${errorMessage}`, 'findings_report');
            res.setHeader('Content-Type', errorReport.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
            res.status(200).send(errorReport.data);
        }
    }
    async getControlStatusReport(query, res) {
        try {
            const report = await this.reportingService.generateReport({
                type: report_query_dto_1.ReportType.CONTROL_STATUS,
                format: query.format || report_query_dto_1.ExportFormat.CSV,
            });
            res.setHeader('Content-Type', report.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
            res.send(report.data);
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Failed to generate report';
            const errorReport = this.reportingService.generateErrorCsv(`Failed to generate control status report: ${errorMessage}`, 'control_status_report');
            res.setHeader('Content-Type', errorReport.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
            res.status(200).send(errorReport.data);
        }
    }
    async getGapAnalysis(query) {
        return this.gapAnalysisService.performGapAnalysis(query);
    }
};
exports.GovernanceReportingController = GovernanceReportingController;
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export governance report' }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: report_query_dto_1.ReportType, description: 'Report type' }),
    (0, swagger_1.ApiQuery)({ name: 'format', enum: report_query_dto_1.ExportFormat, required: false, description: 'Export format (default: csv)' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Status filter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report file downloaded' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], GovernanceReportingController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)('policy-compliance'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate policy compliance report' }),
    (0, swagger_1.ApiQuery)({ name: 'format', enum: report_query_dto_1.ExportFormat, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GovernanceReportingController.prototype, "getPolicyComplianceReport", null);
__decorate([
    (0, common_1.Get)('influencer'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate influencer report' }),
    (0, swagger_1.ApiQuery)({ name: 'format', enum: report_query_dto_1.ExportFormat, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GovernanceReportingController.prototype, "getInfluencerReport", null);
__decorate([
    (0, common_1.Get)('control-implementation'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate control implementation report' }),
    (0, swagger_1.ApiQuery)({ name: 'format', enum: report_query_dto_1.ExportFormat, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GovernanceReportingController.prototype, "getControlImplementationReport", null);
__decorate([
    (0, common_1.Get)('assessment'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate assessment report' }),
    (0, swagger_1.ApiQuery)({ name: 'format', enum: report_query_dto_1.ExportFormat, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GovernanceReportingController.prototype, "getAssessmentReport", null);
__decorate([
    (0, common_1.Get)('findings'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate findings report' }),
    (0, swagger_1.ApiQuery)({ name: 'format', enum: report_query_dto_1.ExportFormat, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GovernanceReportingController.prototype, "getFindingsReport", null);
__decorate([
    (0, common_1.Get)('control-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate control status summary report' }),
    (0, swagger_1.ApiQuery)({ name: 'format', enum: report_query_dto_1.ExportFormat, required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GovernanceReportingController.prototype, "getControlStatusReport", null);
__decorate([
    (0, common_1.Get)('gap-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get gap analysis report for framework mappings' }),
    (0, swagger_1.ApiQuery)({ name: 'frameworkIds', required: false, description: 'Comma-separated framework UUIDs' }),
    (0, swagger_1.ApiQuery)({ name: 'gapType', required: false, enum: ['framework', 'control', 'asset', 'evidence', 'assessment'] }),
    (0, swagger_1.ApiQuery)({ name: 'domain', required: false, description: 'Filter by domain' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by category' }),
    (0, swagger_1.ApiQuery)({ name: 'priorityOnly', required: false, type: Boolean, description: 'Include only critical/high priority gaps' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gap analysis report', type: gap_analysis_dto_1.GapAnalysisDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gap_analysis_dto_1.GapAnalysisQueryDto]),
    __metadata("design:returntype", Promise)
], GovernanceReportingController.prototype, "getGapAnalysis", null);
exports.GovernanceReportingController = GovernanceReportingController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('governance/reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [governance_reporting_service_1.GovernanceReportingService,
        gap_analysis_service_1.GapAnalysisService])
], GovernanceReportingController);
//# sourceMappingURL=governance-reporting.controller.js.map