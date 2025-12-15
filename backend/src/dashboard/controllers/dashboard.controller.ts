import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from '../services/dashboard.service';
import { DashboardOverviewDto } from '../dto/dashboard-overview.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview' })
  @ApiResponse({ status: 200, description: 'Dashboard overview data', type: DashboardOverviewDto })
  async getOverview(): Promise<DashboardOverviewDto> {
    return this.dashboardService.getOverview();
  }
}

