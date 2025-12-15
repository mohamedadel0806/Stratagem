import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GovernanceDashboardService } from '../services/governance-dashboard.service';
import { GovernanceDashboardDto } from '../dto/governance-dashboard.dto';
import { GovernanceTrendService } from '../services/governance-trend.service';
import { GovernanceTrendResponseDto } from '../dto/governance-trend.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('governance')
@Controller('api/v1/governance/dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GovernanceDashboardController {
  constructor(
    private readonly dashboardService: GovernanceDashboardService,
    private readonly trendService: GovernanceTrendService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get Governance dashboard overview' })
  @ApiResponse({
    status: 200,
    description: 'Governance dashboard data',
    type: GovernanceDashboardDto,
  })
  async getDashboard(): Promise<GovernanceDashboardDto> {
    return this.dashboardService.getDashboard();
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get historical metrics and compliance forecast' })
  @ApiResponse({ status: 200, description: 'Historical metrics with projections', type: GovernanceTrendResponseDto })
  async getDashboardTrends(): Promise<GovernanceTrendResponseDto> {
    return this.trendService.getTrend();
  }
}




