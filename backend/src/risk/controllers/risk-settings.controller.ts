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
  constructor(private readonly settingsService: RiskSettingsService) {}

  /**
   * GET /risk-settings
   * Get current risk settings
   */
  @Get()
  async getSettings(
    @Request() req: any,
    @Query('organization_id') organizationId?: string,
  ): Promise<RiskSettingsResponseDto> {
    const orgId = organizationId || req.user?.organizationId;
    return this.settingsService.getSettings(orgId);
  }

  /**
   * PUT /risk-settings
   * Update risk settings
   */
  @Put()
  async updateSettings(
    @Body() updateDto: UpdateRiskSettingsDto,
    @Request() req: any,
    @Query('organization_id') organizationId?: string,
  ): Promise<RiskSettingsResponseDto> {
    const orgId = organizationId || req.user?.organizationId;
    const userId = req.user?.userId;
    return this.settingsService.updateSettings(updateDto, userId, orgId);
  }

  /**
   * POST /risk-settings/reset
   * Reset settings to defaults
   */
  @Post('reset')
  async resetToDefaults(
    @Request() req: any,
    @Query('organization_id') organizationId?: string,
  ): Promise<RiskSettingsResponseDto> {
    const orgId = organizationId || req.user?.organizationId;
    const userId = req.user?.userId;
    return this.settingsService.resetToDefaults(userId, orgId);
  }

  /**
   * GET /risk-settings/risk-level
   * Get risk level for a given score
   */
  @Get('risk-level')
  async getRiskLevel(
    @Query('score') score: number,
    @Request() req: any,
    @Query('organization_id') organizationId?: string,
  ): Promise<{
    level: string;
    color: string;
    description: string;
    responseTime: string;
    escalation: boolean;
  } | { message: string }> {
    const orgId = organizationId || req.user?.organizationId;
    const result = await this.settingsService.getRiskLevelForScore(Number(score), orgId);
    
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
    @Request() req: any,
    @Query('organization_id') organizationId?: string,
  ): Promise<{
    score: number;
    exceedsAppetite: boolean;
    maxAcceptable: number;
  }> {
    const orgId = organizationId || req.user?.organizationId;
    const settings = await this.settingsService.getSettings(orgId);
    const exceedsAppetite = await this.settingsService.exceedsRiskAppetite(Number(score), orgId);
    
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
  async getAssessmentMethods(
    @Request() req: any,
    @Query('organization_id') organizationId?: string,
  ): Promise<{
    id: string;
    name: string;
    description: string;
    likelihoodScale: number;
    impactScale: number;
    isDefault: boolean;
  }[]> {
    const orgId = organizationId || req.user?.organizationId;
    return this.settingsService.getActiveAssessmentMethods(orgId);
  }

  /**
   * GET /risk-settings/likelihood-scale
   * Get likelihood scale descriptions
   */
  @Get('likelihood-scale')
  async getLikelihoodScale(
    @Request() req: any,
    @Query('organization_id') organizationId?: string,
  ): Promise<{
    value: number;
    label: string;
    description: string;
  }[]> {
    const orgId = organizationId || req.user?.organizationId;
    return this.settingsService.getLikelihoodScale(orgId);
  }

  /**
   * GET /risk-settings/impact-scale
   * Get impact scale descriptions
   */
  @Get('impact-scale')
  async getImpactScale(
    @Request() req: any,
    @Query('organization_id') organizationId?: string,
  ): Promise<{
    value: number;
    label: string;
    description: string;
  }[]> {
    const orgId = organizationId || req.user?.organizationId;
    return this.settingsService.getImpactScale(orgId);
  }
}







