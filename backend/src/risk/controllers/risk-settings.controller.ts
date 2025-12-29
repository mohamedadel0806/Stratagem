import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskSettingsService } from '../services/risk-settings.service';
import { UpdateRiskSettingsDto, RiskSettingsResponseDto } from '../dto/settings/risk-settings.dto';

@Controller('risk-settings')
@UseGuards(JwtAuthGuard)
export class RiskSettingsController {
  constructor(private readonly settingsService: RiskSettingsService) { }

  /**
   * GET /risk-settings
   * Get current risk settings
   */
  @Get()
  async getSettings(@Request() req: any): Promise<RiskSettingsResponseDto> {
    return this.settingsService.getSettings();
  }

  /**
   * PUT /risk-settings
   * Update risk settings
   */
  @Put()
  async updateSettings(
    @Body() updateDto: UpdateRiskSettingsDto,
    @Request() req: any,
  ): Promise<RiskSettingsResponseDto> {
    const userId = req.user?.userId || req.user?.id;
    return this.settingsService.updateSettings(updateDto, userId);
  }

  /**
   * POST /risk-settings/reset
   * Reset settings to defaults
   */
  @Post('reset')
  async resetToDefaults(@Request() req: any): Promise<RiskSettingsResponseDto> {
    const userId = req.user?.userId || req.user?.id;
    return this.settingsService.resetToDefaults(userId);
  }

  /**
   * GET /risk-settings/risk-level
   * Get risk level for a given score
   */
  @Get('risk-level')
  async getRiskLevel(
    @Query('score') score: number,
  ): Promise<{
    level: string;
    color: string;
    description: string;
    responseTime: string;
    escalation: boolean;
  } | { message: string }> {
    const result = await this.settingsService.getRiskLevelForScore(Number(score));

    if (!result) {
      return { message: 'No risk level found for the given score' };
    }

    return result;
  }

  /**
   * GET /risk-settings/check-appetite
   * Check if a score exceeds risk appetite
   */
  @Get('check-appetite')
  async checkRiskAppetite(
    @Query('score') score: number,
  ): Promise<{
    score: number;
    exceedsAppetite: boolean;
    maxAcceptable: number;
  }> {
    const settings = await this.settingsService.getSettings();
    const exceedsAppetite = await this.settingsService.exceedsRiskAppetite(Number(score));

    return {
      score: Number(score),
      exceedsAppetite,
      maxAcceptable: settings.max_acceptable_risk_score,
    };
  }

  /**
   * GET /risk-settings/assessment-methods
   * Get active assessment methods
   */
  @Get('assessment-methods')
  async getAssessmentMethods(): Promise<{
    id: string;
    name: string;
    description: string;
    likelihoodScale: number;
    impactScale: number;
    isDefault: boolean;
  }[]> {
    return this.settingsService.getActiveAssessmentMethods();
  }

  /**
   * GET /risk-settings/likelihood-scale
   * Get likelihood scale descriptions
   */
  @Get('likelihood-scale')
  async getLikelihoodScale(): Promise<{
    value: number;
    label: string;
    description: string;
  }[]> {
    return this.settingsService.getLikelihoodScale();
  }

  /**
   * GET /risk-settings/impact-scale
   * Get impact scale descriptions
   */
  @Get('impact-scale')
  async getImpactScale(): Promise<{
    value: number;
    label: string;
    description: string;
  }[]> {
    return this.settingsService.getImpactScale();
  }
}







