import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ComplianceScorecardService, ComplianceScorecardResponse } from '../services/compliance-scorecard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Governance - Compliance Scorecard')
@Controller('api/v1/governance/scorecard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComplianceScorecardController {
  constructor(private readonly scorecardService: ComplianceScorecardService) {}

  @Get()
  @ApiOperation({ summary: 'Generate framework compliance scorecard' })
  @ApiQuery({ name: 'frameworkIds', required: false, type: String, description: 'Comma-separated framework IDs' })
  @ApiResponse({ status: 200, description: 'Compliance scorecard data' })
  async getScorecard(@Query('frameworkIds') frameworkIds?: string): Promise<ComplianceScorecardResponse> {
    const ids = frameworkIds ? frameworkIds.split(',').map((id) => id.trim()) : undefined;
    return this.scorecardService.generateScorecard(ids);
  }
}
