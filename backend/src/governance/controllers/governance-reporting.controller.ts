import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { GovernanceReportingService } from '../services/governance-reporting.service';
import { GapAnalysisService } from '../services/gap-analysis.service';
import { ReportQueryDto, ReportType, ExportFormat } from '../dto/report-query.dto';
import { GapAnalysisQueryDto, GapAnalysisDto } from '../dto/gap-analysis.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('governance')
@Controller('governance/reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GovernanceReportingController {
  constructor(
    private readonly reportingService: GovernanceReportingService,
    private readonly gapAnalysisService: GapAnalysisService,
  ) { }

  @Get('export')
  @ApiOperation({ summary: 'Export governance report' })
  @ApiQuery({ name: 'type', enum: ReportType, description: 'Report type' })
  @ApiQuery({ name: 'format', enum: ExportFormat, required: false, description: 'Export format (default: csv)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'status', required: false, description: 'Status filter' })
  @ApiResponse({ status: 200, description: 'Report file downloaded' })
  async exportReport(@Query() query: ReportQueryDto, @Res() res: Response): Promise<void> {
    const report = await this.reportingService.generateReport(query);

    res.setHeader('Content-Type', report.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
    res.send(report.data);
  }

  @Get('policy-compliance')
  @ApiOperation({ summary: 'Generate policy compliance report' })
  @ApiQuery({ name: 'format', enum: ExportFormat, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getPolicyComplianceReport(@Query() query: Partial<ReportQueryDto>, @Res() res: Response): Promise<void> {
    try {
      const report = await this.reportingService.generateReport({
        type: ReportType.POLICY_COMPLIANCE,
        format: query.format || ExportFormat.CSV,
        startDate: query.startDate,
        endDate: query.endDate,
        status: query.status,
      });

      res.setHeader('Content-Type', report.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
      res.send(report.data);
    } catch (error: any) {
      // Return error as CSV
      const errorMessage = error?.message || 'Failed to generate report';
      const errorReport = this.reportingService.generateErrorCsv(
        `Failed to generate policy compliance report: ${errorMessage}`,
        'policy_compliance_report',
      );
      res.setHeader('Content-Type', errorReport.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
      res.status(200).send(errorReport.data);
    }
  }

  @Get('influencer')
  @ApiOperation({ summary: 'Generate influencer report' })
  @ApiQuery({ name: 'format', enum: ExportFormat, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getInfluencerReport(@Query() query: Partial<ReportQueryDto>, @Res() res: Response): Promise<void> {
    try {
      const report = await this.reportingService.generateReport({
        type: ReportType.INFLUENCER,
        format: query.format || ExportFormat.CSV,
        startDate: query.startDate,
        endDate: query.endDate,
        status: query.status,
      });

      res.setHeader('Content-Type', report.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
      res.send(report.data);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to generate report';
      const errorReport = this.reportingService.generateErrorCsv(
        `Failed to generate influencer report: ${errorMessage}`,
        'influencer_report',
      );
      res.setHeader('Content-Type', errorReport.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
      res.status(200).send(errorReport.data);
    }
  }

  @Get('control-implementation')
  @ApiOperation({ summary: 'Generate control implementation report' })
  @ApiQuery({ name: 'format', enum: ExportFormat, required: false })
  @ApiQuery({ name: 'status', required: false })
  async getControlImplementationReport(
    @Query() query: Partial<ReportQueryDto>,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const report = await this.reportingService.generateReport({
        type: ReportType.CONTROL_IMPLEMENTATION,
        format: query.format || ExportFormat.CSV,
        status: query.status,
      });

      res.setHeader('Content-Type', report.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
      res.send(report.data);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to generate report';
      const errorReport = this.reportingService.generateErrorCsv(
        `Failed to generate control implementation report: ${errorMessage}`,
        'control_implementation_report',
      );
      res.setHeader('Content-Type', errorReport.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
      res.status(200).send(errorReport.data);
    }
  }

  @Get('assessment')
  @ApiOperation({ summary: 'Generate assessment report' })
  @ApiQuery({ name: 'format', enum: ExportFormat, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getAssessmentReport(@Query() query: Partial<ReportQueryDto>, @Res() res: Response): Promise<void> {
    try {
      const report = await this.reportingService.generateReport({
        type: ReportType.ASSESSMENT,
        format: query.format || ExportFormat.CSV,
        startDate: query.startDate,
        endDate: query.endDate,
        status: query.status,
      });

      res.setHeader('Content-Type', report.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
      res.send(report.data);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to generate report';
      const errorReport = this.reportingService.generateErrorCsv(
        `Failed to generate assessment report: ${errorMessage}`,
        'assessment_report',
      );
      res.setHeader('Content-Type', errorReport.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
      res.status(200).send(errorReport.data);
    }
  }

  @Get('findings')
  @ApiOperation({ summary: 'Generate findings report' })
  @ApiQuery({ name: 'format', enum: ExportFormat, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getFindingsReport(@Query() query: Partial<ReportQueryDto>, @Res() res: Response): Promise<void> {
    try {
      const report = await this.reportingService.generateReport({
        type: ReportType.FINDINGS,
        format: query.format || ExportFormat.CSV,
        startDate: query.startDate,
        endDate: query.endDate,
        status: query.status,
      });

      res.setHeader('Content-Type', report.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
      res.send(report.data);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to generate report';
      const errorReport = this.reportingService.generateErrorCsv(
        `Failed to generate findings report: ${errorMessage}`,
        'findings_report',
      );
      res.setHeader('Content-Type', errorReport.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
      res.status(200).send(errorReport.data);
    }
  }

  @Get('control-status')
  @ApiOperation({ summary: 'Generate control status summary report' })
  @ApiQuery({ name: 'format', enum: ExportFormat, required: false })
  async getControlStatusReport(@Query() query: Partial<ReportQueryDto>, @Res() res: Response): Promise<void> {
    try {
      const report = await this.reportingService.generateReport({
        type: ReportType.CONTROL_STATUS,
        format: query.format || ExportFormat.CSV,
      });

      res.setHeader('Content-Type', report.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
      res.send(report.data);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to generate report';
      const errorReport = this.reportingService.generateErrorCsv(
        `Failed to generate control status report: ${errorMessage}`,
        'control_status_report',
      );
      res.setHeader('Content-Type', errorReport.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${errorReport.filename}"`);
      res.status(200).send(errorReport.data);
    }
  }

  @Get('gap-analysis')
  @ApiOperation({ summary: 'Get gap analysis report for framework mappings' })
  @ApiQuery({ name: 'frameworkIds', required: false, description: 'Comma-separated framework UUIDs' })
  @ApiQuery({ name: 'gapType', required: false, enum: ['framework', 'control', 'asset', 'evidence', 'assessment'] })
  @ApiQuery({ name: 'domain', required: false, description: 'Filter by domain' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'priorityOnly', required: false, type: Boolean, description: 'Include only critical/high priority gaps' })
  @ApiResponse({ status: 200, description: 'Gap analysis report', type: GapAnalysisDto })
  async getGapAnalysis(@Query() query: GapAnalysisQueryDto): Promise<GapAnalysisDto> {
    return this.gapAnalysisService.performGapAnalysis(query);
  }
}

