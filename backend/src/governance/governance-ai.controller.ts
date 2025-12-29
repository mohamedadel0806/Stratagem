import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GovernanceAIService, AISuggestion } from './services/governance-ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireFeature } from '../common/decorators/require-feature.decorator';
import { TenantFeature } from '../common/constants/tier-config';

@ApiTags('Governance - AI')
@Controller('governance/ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@RequireFeature(TenantFeature.ADVANCED_ANALYTICS)
export class GovernanceAIController {
  constructor(private readonly aiService: GovernanceAIService) { }

  @Get('suggest-mappings/:influencerId')
  @ApiOperation({ summary: 'Get AI-powered mapping suggestions for an influencer' })
  async suggestMappings(
    @Param('influencerId') influencerId: string,
  ): Promise<AISuggestion[]> {
    return this.aiService.suggestMappings(influencerId);
  }

  @Get('predict-effectiveness/:controlId')
  @ApiOperation({ summary: 'Get AI-powered effectiveness prediction for a control' })
  async predictEffectiveness(@Param('controlId') controlId: string) {
    return this.aiService.predictControlEffectiveness(controlId);
  }

  @Post('simulate-policy-impact/:policyId')
  @ApiOperation({ summary: 'Simulate the impact of proposed policy changes' })
  async simulatePolicyImpact(
    @Param('policyId') policyId: string,
    @Body() proposedChanges: any,
  ) {
    return this.aiService.simulatePolicyImpact(policyId, proposedChanges);
  }
}


