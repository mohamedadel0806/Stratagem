import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';
import { ComplianceReportingService } from './services/compliance-reporting.service';
import {
  CreateComplianceReportDto,
  ComplianceReportDto,
  ComplianceDashboardDto,
  ComplianceReportFilterDto,
} from './dto/compliance-report.dto';

@ApiTags('Compliance Reporting')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('governance/compliance')
export class ComplianceReportingController {
  constructor(private readonly complianceReportingService: ComplianceReportingService) {}

  @Post('reports/generate')
  @HttpCode(HttpStatus.CREATED)
  @Audit(AuditAction.CREATE, 'COMPLIANCE_REPORT')
  @ApiOperation({ summary: 'Generate comprehensive compliance report' })
  @ApiResponse({
    status: 201,
    description: 'Compliance report generated successfully',
    type: ComplianceReportDto,
  })
  async generateReport(
    @Body() createReportDto: CreateComplianceReportDto,
    @Request() req,
  ): Promise<ComplianceReportDto> {
    return this.complianceReportingService.generateComplianceReport(createReportDto, req.user.id);
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Get compliance report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Compliance report retrieved successfully',
    type: ComplianceReportDto,
  })
  async getReport(@Param('id') reportId: string): Promise<ComplianceReportDto> {
    return this.complianceReportingService.getReport(reportId);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get all compliance reports with filtering' })
  @ApiResponse({
    status: 200,
    description: 'Compliance reports retrieved successfully',
  })
  async getReports(@Query() filterDto: ComplianceReportFilterDto): Promise<{ data: ComplianceReportDto[]; total: number }> {
    return this.complianceReportingService.getReports(filterDto);
  }

  @Get('reports/latest/current')
  @ApiOperation({ summary: 'Get latest compliance report' })
  @ApiResponse({
    status: 200,
    description: 'Latest compliance report retrieved',
    type: ComplianceReportDto,
  })
  async getLatestReport(): Promise<ComplianceReportDto> {
    return this.complianceReportingService.getLatestReport();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get compliance dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: ComplianceDashboardDto,
  })
  async getDashboard(): Promise<ComplianceDashboardDto> {
    return this.complianceReportingService.getComplianceDashboard();
  }

  @Patch('reports/:id/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Audit(AuditAction.ARCHIVE, 'COMPLIANCE_REPORT')
  @ApiOperation({ summary: 'Archive a compliance report' })
  @ApiResponse({ status: 204, description: 'Report archived successfully' })
  async archiveReport(@Param('id') reportId: string): Promise<void> {
    return this.complianceReportingService.archiveReport(reportId);
  }
}
