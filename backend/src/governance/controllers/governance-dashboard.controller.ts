import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GovernanceDashboardService } from '../services/governance-dashboard.service';
import { GovernanceDashboardDto } from '../dto/governance-dashboard.dto';
import { GovernanceTrendService } from '../services/governance-trend.service';
import { GovernanceTrendResponseDto } from '../dto/governance-trend.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('governance')
@Controller('governance/dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GovernanceDashboardController {
  constructor(
    private readonly dashboardService: GovernanceDashboardService,
    private readonly trendService: GovernanceTrendService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get Governance dashboard overview' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date for filtering (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date for filtering (ISO 8601)' })
  @ApiResponse({
    status: 200,
    description: 'Governance dashboard data',
    type: GovernanceDashboardDto,
  })
  async getDashboard(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<GovernanceDashboardDto> {
    return this.dashboardService.getDashboard(startDate, endDate);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get historical metrics and compliance forecast' })
  @ApiResponse({ status: 200, description: 'Historical metrics with projections', type: GovernanceTrendResponseDto })
  async getDashboardTrends(): Promise<GovernanceTrendResponseDto> {
    return this.trendService.getTrend();
  }

  @Get('effectiveness/trends')
  @ApiOperation({ summary: 'Get historical control effectiveness trends' })
  async getEffectivenessTrends(
    @Query('controlId') controlId?: string,
    @Query('rangeDays') rangeDays?: number,
  ) {
    return this.trendService.getControlEffectivenessTrend(controlId, rangeDays);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export dashboard to PDF' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'PDF file', content: { 'application/pdf': {} } })
  async exportDashboard(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // For now, return a placeholder - PDF generation would require a library like puppeteer or pdfkit
    // This is a placeholder implementation
    const dashboard = await this.dashboardService.getDashboard(startDate, endDate);
    
    // In a real implementation, you would:
    // 1. Generate PDF using a library (puppeteer, pdfkit, etc.)
    // 2. Return the PDF buffer
    // For now, we'll return JSON as a placeholder
    
    return {
      message: 'PDF export functionality will be implemented with a PDF generation library',
      data: dashboard,
    };
  }
}







