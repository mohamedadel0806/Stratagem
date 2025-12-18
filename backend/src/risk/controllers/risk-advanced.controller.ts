import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskAdvancedService } from '../services/risk-advanced.service';
import {
  RiskComparisonRequestDto,
  RiskComparisonResponseDto,
  WhatIfScenarioRequestDto,
  WhatIfScenarioResponseDto,
  BatchWhatIfRequestDto,
  CustomReportConfigDto,
} from '../dto/advanced/risk-comparison.dto';

@ApiTags('Risk Advanced Features')
@Controller('risks/advanced')
@UseGuards(JwtAuthGuard)
export class RiskAdvancedController {
  constructor(private readonly advancedService: RiskAdvancedService) {}

  // =====================
  // RISK COMPARISON
  // =====================

  @Post('compare')
  @ApiOperation({ 
    summary: 'Compare multiple risks side-by-side',
    description: 'Provides detailed comparison of selected risks including scores, levels, controls, and calculated metrics like risk reduction percentage',
  })
  @ApiBody({ type: RiskComparisonRequestDto })
  @ApiResponse({ status: 200, description: 'Risk comparison data', type: RiskComparisonResponseDto })
  async compareRisks(
    @Body() request: RiskComparisonRequestDto,
    @Request() req: any,
  ): Promise<RiskComparisonResponseDto> {
    return this.advancedService.compareRisks(request, req.user?.organizationId);
  }

  // =====================
  // WHAT-IF ANALYSIS
  // =====================

  @Post('what-if')
  @ApiOperation({ 
    summary: 'Simulate what-if scenario for a risk',
    description: 'Analyze how changing likelihood, impact, or control effectiveness would affect the risk score and level',
  })
  @ApiBody({ type: WhatIfScenarioRequestDto })
  @ApiResponse({ status: 200, description: 'What-if analysis result', type: WhatIfScenarioResponseDto })
  async simulateWhatIf(
    @Body() request: WhatIfScenarioRequestDto,
    @Request() req: any,
  ): Promise<WhatIfScenarioResponseDto> {
    return this.advancedService.simulateWhatIf(request, req.user?.organizationId);
  }

  @Post('what-if/batch')
  @ApiOperation({ 
    summary: 'Compare multiple what-if scenarios',
    description: 'Run multiple scenarios for a single risk to compare different mitigation strategies',
  })
  @ApiBody({ type: BatchWhatIfRequestDto })
  @ApiResponse({ status: 200, description: 'Array of what-if results', type: [WhatIfScenarioResponseDto] })
  async batchWhatIf(
    @Body() request: BatchWhatIfRequestDto,
    @Request() req: any,
  ): Promise<WhatIfScenarioResponseDto[]> {
    return this.advancedService.batchWhatIf(request, req.user?.organizationId);
  }

  // =====================
  // CUSTOM REPORTS
  // =====================

  @Post('reports/generate')
  @ApiOperation({ 
    summary: 'Generate custom risk report',
    description: 'Create a customized report with selected fields, filters, sorting, and grouping options',
  })
  @ApiBody({ type: CustomReportConfigDto })
  @ApiResponse({ status: 200, description: 'Generated report data' })
  async generateReport(
    @Body() config: CustomReportConfigDto,
    @Request() req: any,
  ) {
    return this.advancedService.generateCustomReport(config, req.user?.organizationId);
  }

  @Get('reports/fields')
  @ApiOperation({ 
    summary: 'Get available report fields',
    description: 'Returns all available fields that can be included in custom reports, organized by category',
  })
  @ApiResponse({ status: 200, description: 'List of available report fields' })
  getAvailableFields() {
    return this.advancedService.getAvailableReportFields();
  }

  // =====================
  // QUICK ANALYSIS ENDPOINTS
  // =====================

  @Get('quick-compare')
  @ApiOperation({ 
    summary: 'Quick compare risks by IDs (GET)',
    description: 'Compare risks using query parameters (convenience endpoint)',
  })
  @ApiResponse({ status: 200, description: 'Risk comparison data' })
  async quickCompare(
    @Query('ids') ids: string,
    @Request() req: any,
  ): Promise<RiskComparisonResponseDto> {
    const riskIds = ids.split(',').filter(id => id.trim());
    return this.advancedService.compareRisks({ risk_ids: riskIds }, req.user?.organizationId);
  }

  @Get('quick-whatif')
  @ApiOperation({ 
    summary: 'Quick what-if analysis (GET)',
    description: 'Run a what-if scenario using query parameters',
  })
  @ApiResponse({ status: 200, description: 'What-if analysis result' })
  async quickWhatIf(
    @Query('risk_id') riskId: string,
    @Query('likelihood') likelihood?: string,
    @Query('impact') impact?: string,
    @Query('control_effectiveness') controlEffectiveness?: string,
    @Query('additional_controls') additionalControls?: string,
    @Request() req?: any,
  ): Promise<WhatIfScenarioResponseDto> {
    return this.advancedService.simulateWhatIf(
      {
        risk_id: riskId,
        simulated_likelihood: likelihood ? parseInt(likelihood) : undefined,
        simulated_impact: impact ? parseInt(impact) : undefined,
        simulated_control_effectiveness: controlEffectiveness ? parseInt(controlEffectiveness) : undefined,
        additional_controls: additionalControls ? parseInt(additionalControls) : undefined,
      },
      req?.user?.organizationId,
    );
  }
}





