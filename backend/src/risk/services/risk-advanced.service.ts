import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Risk, RiskLevel } from '../entities/risk.entity';
import { RiskAssetLink } from '../entities/risk-asset-link.entity';
import { RiskControlLink } from '../entities/risk-control-link.entity';
import { RiskTreatment, TreatmentStatus } from '../entities/risk-treatment.entity';
import { KRIRiskLink } from '../entities/kri-risk-link.entity';
import { RiskSettingsService } from './risk-settings.service';
import {
  RiskComparisonRequestDto,
  RiskComparisonResponseDto,
  RiskComparisonDataDto,
  WhatIfScenarioRequestDto,
  WhatIfScenarioResponseDto,
  BatchWhatIfRequestDto,
  CustomReportConfigDto,
} from '../dto/advanced/risk-comparison.dto';

@Injectable()
export class RiskAdvancedService {
  constructor(
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
    @InjectRepository(RiskAssetLink)
    private assetLinkRepository: Repository<RiskAssetLink>,
    @InjectRepository(RiskControlLink)
    private controlLinkRepository: Repository<RiskControlLink>,
    @InjectRepository(RiskTreatment)
    private treatmentRepository: Repository<RiskTreatment>,
    @InjectRepository(KRIRiskLink)
    private kriLinkRepository: Repository<KRIRiskLink>,
    private riskSettingsService: RiskSettingsService,
  ) {}

  /**
   * Compare multiple risks side-by-side
   */
  async compareRisks(
    request: RiskComparisonRequestDto,
    organizationId?: string,
  ): Promise<RiskComparisonResponseDto> {
    const risks = await this.riskRepository.find({
      where: { id: In(request.risk_ids), deleted_at: IsNull() },
      relations: ['owner', 'risk_category'],
    });

    if (risks.length === 0) {
      throw new NotFoundException('No risks found with the provided IDs');
    }

    // Get integration counts
    const riskIds = risks.map(r => r.id);
    const counts = await this.getIntegrationCounts(riskIds);

    // Build comparison data
    const comparisonData: RiskComparisonDataDto[] = risks.map(risk => {
      const inherentScore = risk.inherent_risk_score || 
        (risk.inherent_likelihood && risk.inherent_impact ? risk.inherent_likelihood * risk.inherent_impact : null);
      const currentScore = risk.current_risk_score || 
        (risk.current_likelihood && risk.current_impact ? risk.current_likelihood * risk.current_impact : null);
      const targetScore = risk.target_risk_score ||
        (risk.target_likelihood && risk.target_impact ? risk.target_likelihood * risk.target_impact : null);

      // Calculate risk reduction percentage
      const riskReduction = inherentScore && currentScore
        ? Math.round(((inherentScore - currentScore) / inherentScore) * 100)
        : null;

      // Calculate gap to target
      const gapToTarget = currentScore && targetScore ? currentScore - targetScore : null;

      return {
        id: risk.id,
        risk_id: risk.risk_id,
        title: risk.title,
        category_name: risk.risk_category?.name,
        status: risk.status,
        owner_name: risk.owner 
          ? `${risk.owner.firstName || ''} ${risk.owner.lastName || ''}`.trim()
          : undefined,
        inherent_likelihood: risk.inherent_likelihood,
        inherent_impact: risk.inherent_impact,
        inherent_risk_score: inherentScore,
        inherent_risk_level: risk.inherent_risk_level,
        current_likelihood: risk.current_likelihood,
        current_impact: risk.current_impact,
        current_risk_score: currentScore,
        current_risk_level: risk.current_risk_level,
        target_likelihood: risk.target_likelihood,
        target_impact: risk.target_impact,
        target_risk_score: targetScore,
        target_risk_level: risk.target_risk_level,
        control_effectiveness: risk.control_effectiveness,
        linked_controls_count: counts[risk.id]?.linked_controls_count || 0,
        linked_assets_count: counts[risk.id]?.linked_assets_count || 0,
        active_treatments_count: counts[risk.id]?.active_treatments_count || 0,
        kri_count: counts[risk.id]?.kri_count || 0,
        risk_reduction_percentage: riskReduction,
        gap_to_target: gapToTarget,
      };
    });

    // Calculate summary statistics
    const scores = comparisonData
      .map(r => r.current_risk_score)
      .filter((s): s is number => s !== null && s !== undefined);
    
    const avgScore = scores.length > 0 
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;

    const sortedByScore = [...comparisonData]
      .filter(r => r.current_risk_score !== null && r.current_risk_score !== undefined)
      .sort((a, b) => (b.current_risk_score || 0) - (a.current_risk_score || 0));

    const highestRisk = sortedByScore[0];
    const lowestRisk = sortedByScore[sortedByScore.length - 1];

    const avgEffectiveness = comparisonData
      .map(r => r.control_effectiveness)
      .filter((e): e is number => e !== null && e !== undefined);
    
    const summary = {
      total_risks: comparisonData.length,
      average_current_score: avgScore,
      highest_risk: highestRisk 
        ? { id: highestRisk.id, title: highestRisk.title, score: highestRisk.current_risk_score || 0 }
        : { id: '', title: '', score: 0 },
      lowest_risk: lowestRisk
        ? { id: lowestRisk.id, title: lowestRisk.title, score: lowestRisk.current_risk_score || 0 }
        : { id: '', title: '', score: 0 },
      average_control_effectiveness: avgEffectiveness.length > 0
        ? Math.round(avgEffectiveness.reduce((a, b) => a + b, 0) / avgEffectiveness.length)
        : 0,
      total_linked_controls: comparisonData.reduce((sum, r) => sum + (r.linked_controls_count || 0), 0),
      total_active_treatments: comparisonData.reduce((sum, r) => sum + (r.active_treatments_count || 0), 0),
    };

    // Build comparison matrix
    const comparisonMatrix = [
      {
        metric: 'Current Risk Score',
        values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.current_risk_score || 0 })),
        variance: scores.length > 1 ? Math.max(...scores) - Math.min(...scores) : 0,
      },
      {
        metric: 'Current Likelihood',
        values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.current_likelihood || 0 })),
      },
      {
        metric: 'Current Impact',
        values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.current_impact || 0 })),
      },
      {
        metric: 'Risk Level',
        values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.current_risk_level || 'unknown' })),
      },
      {
        metric: 'Control Effectiveness',
        values: comparisonData.map(r => ({ risk_id: r.risk_id, value: `${r.control_effectiveness || 0}%` })),
      },
      {
        metric: 'Risk Reduction',
        values: comparisonData.map(r => ({ risk_id: r.risk_id, value: `${r.risk_reduction_percentage || 0}%` })),
      },
      {
        metric: 'Gap to Target',
        values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.gap_to_target || 0 })),
      },
      {
        metric: 'Linked Controls',
        values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.linked_controls_count || 0 })),
      },
      {
        metric: 'Active Treatments',
        values: comparisonData.map(r => ({ risk_id: r.risk_id, value: r.active_treatments_count || 0 })),
      },
    ];

    return {
      risks: comparisonData,
      summary,
      comparison_matrix: comparisonMatrix,
    };
  }

  /**
   * What-If Scenario Analysis
   */
  async simulateWhatIf(
    request: WhatIfScenarioRequestDto,
    organizationId?: string,
  ): Promise<WhatIfScenarioResponseDto> {
    const risk = await this.riskRepository.findOne({
      where: { id: request.risk_id, deleted_at: IsNull() },
    });

    if (!risk) {
      throw new NotFoundException(`Risk with ID ${request.risk_id} not found`);
    }

    // Get settings for risk level calculation
    const settings = await this.riskSettingsService.getSettings(organizationId);

    // Original values
    const originalLikelihood = risk.current_likelihood || Number(risk.likelihood) || 3;
    const originalImpact = risk.current_impact || Number(risk.impact) || 3;
    const originalScore = originalLikelihood * originalImpact;
    const originalLevel = await this.getRiskLevelFromSettings(originalScore, organizationId);
    const originalEffectiveness = risk.control_effectiveness || 0;

    // Simulated values
    const simulatedLikelihood = request.simulated_likelihood ?? originalLikelihood;
    const simulatedImpact = request.simulated_impact ?? originalImpact;
    let simulatedEffectiveness = request.simulated_control_effectiveness ?? originalEffectiveness;

    // Adjust for additional controls (each control adds ~10% effectiveness, max 100%)
    if (request.additional_controls) {
      simulatedEffectiveness = Math.min(100, simulatedEffectiveness + (request.additional_controls * 10));
    }

    // Calculate simulated score (with control effectiveness reduction)
    const baseSimulatedScore = simulatedLikelihood * simulatedImpact;
    const effectivenessReduction = simulatedEffectiveness / 100;
    const simulatedScore = Math.max(1, Math.round(baseSimulatedScore * (1 - effectivenessReduction * 0.5)));
    const simulatedLevel = await this.getRiskLevelFromSettings(simulatedScore, organizationId);

    // Check risk appetite
    const exceedsAppetite = settings.enable_risk_appetite && 
      simulatedScore > settings.max_acceptable_risk_score;

    // Get risk level details
    const levelDetails = await this.riskSettingsService.getRiskLevelForScore(simulatedScore, organizationId);

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      originalScore,
      simulatedScore,
      originalLevel,
      simulatedLevel,
      exceedsAppetite,
      request,
    );

    return {
      original: {
        likelihood: originalLikelihood,
        impact: originalImpact,
        risk_score: originalScore,
        risk_level: originalLevel,
        control_effectiveness: originalEffectiveness,
      },
      simulated: {
        likelihood: simulatedLikelihood,
        impact: simulatedImpact,
        risk_score: simulatedScore,
        risk_level: simulatedLevel,
        control_effectiveness: simulatedEffectiveness,
      },
      impact_analysis: {
        score_change: simulatedScore - originalScore,
        score_change_percentage: originalScore > 0 
          ? Math.round(((simulatedScore - originalScore) / originalScore) * 100)
          : 0,
        level_changed: originalLevel !== simulatedLevel,
        old_level: originalLevel,
        new_level: simulatedLevel,
        exceeds_appetite: exceedsAppetite,
        appetite_threshold: settings.max_acceptable_risk_score,
        recommendation,
      },
      risk_level_details: levelDetails ? {
        color: levelDetails.color,
        description: levelDetails.description,
        response_time: levelDetails.responseTime,
        requires_escalation: levelDetails.escalation,
      } : undefined,
    };
  }

  /**
   * Batch What-If Analysis (compare multiple scenarios)
   */
  async batchWhatIf(
    request: BatchWhatIfRequestDto,
    organizationId?: string,
  ): Promise<WhatIfScenarioResponseDto[]> {
    const results: WhatIfScenarioResponseDto[] = [];

    for (const scenario of request.scenarios) {
      const result = await this.simulateWhatIf(
        { risk_id: request.risk_id, ...scenario },
        organizationId,
      );
      results.push(result);
    }

    return results;
  }

  /**
   * Generate Custom Risk Report
   */
  async generateCustomReport(
    config: CustomReportConfigDto,
    organizationId?: string,
  ): Promise<{
    report_name: string;
    generated_at: string;
    filters_applied: Record<string, any>;
    data: any[];
    summary?: Record<string, any>;
    grouped_data?: Record<string, any[]>;
  }> {
    let queryBuilder = this.riskRepository.createQueryBuilder('risk')
      .leftJoinAndSelect('risk.owner', 'owner')
      .leftJoinAndSelect('risk.risk_category', 'risk_category')
      .leftJoinAndSelect('risk.risk_analyst', 'risk_analyst')
      .where('risk.deleted_at IS NULL');

    // Apply filters
    if (config.risk_levels && config.risk_levels.length > 0) {
      queryBuilder.andWhere('risk.current_risk_level IN (:...levels)', { levels: config.risk_levels });
    }

    if (config.statuses && config.statuses.length > 0) {
      queryBuilder.andWhere('risk.status IN (:...statuses)', { statuses: config.statuses });
    }

    if (config.owner_ids && config.owner_ids.length > 0) {
      queryBuilder.andWhere('risk.ownerId IN (:...ownerIds)', { ownerIds: config.owner_ids });
    }

    if (config.categories && config.categories.length > 0) {
      queryBuilder.andWhere('risk.category_id IN (:...categoryIds)', { categoryIds: config.categories });
    }

    // Apply sorting
    if (config.sort_by) {
      const direction = config.sort_direction || 'DESC';
      queryBuilder.orderBy(`risk.${config.sort_by}`, direction);
    } else {
      queryBuilder.orderBy('risk.current_risk_score', 'DESC');
    }

    const risks = await queryBuilder.getMany();

    // Filter by risk appetite if needed
    let filteredRisks = risks;
    if (config.exceeds_appetite_only) {
      const settings = await this.riskSettingsService.getSettings(organizationId);
      filteredRisks = risks.filter(r => 
        r.current_risk_score && r.current_risk_score > settings.max_acceptable_risk_score
      );
    }

    // Get integration counts
    const riskIds = filteredRisks.map(r => r.id);
    const counts = await this.getIntegrationCounts(riskIds);

    // Build report data with selected fields
    const reportData = filteredRisks.map(risk => {
      const fullData: Record<string, any> = {
        id: risk.id,
        risk_id: risk.risk_id,
        title: risk.title,
        description: risk.description,
        risk_statement: risk.risk_statement,
        category: risk.category,
        category_name: risk.risk_category?.name,
        status: risk.status,
        owner_name: risk.owner 
          ? `${risk.owner.firstName || ''} ${risk.owner.lastName || ''}`.trim()
          : undefined,
        analyst_name: risk.risk_analyst
          ? `${risk.risk_analyst.firstName || ''} ${risk.risk_analyst.lastName || ''}`.trim()
          : undefined,
        inherent_likelihood: risk.inherent_likelihood,
        inherent_impact: risk.inherent_impact,
        inherent_risk_score: risk.inherent_risk_score,
        inherent_risk_level: risk.inherent_risk_level,
        current_likelihood: risk.current_likelihood,
        current_impact: risk.current_impact,
        current_risk_score: risk.current_risk_score,
        current_risk_level: risk.current_risk_level,
        target_likelihood: risk.target_likelihood,
        target_impact: risk.target_impact,
        target_risk_score: risk.target_risk_score,
        target_risk_level: risk.target_risk_level,
        control_effectiveness: risk.control_effectiveness,
        threat_source: risk.threat_source,
        risk_velocity: risk.risk_velocity,
        date_identified: risk.date_identified,
        next_review_date: risk.next_review_date,
        last_review_date: risk.last_review_date,
        linked_controls_count: counts[risk.id]?.linked_controls_count || 0,
        linked_assets_count: counts[risk.id]?.linked_assets_count || 0,
        active_treatments_count: counts[risk.id]?.active_treatments_count || 0,
        kri_count: counts[risk.id]?.kri_count || 0,
        created_at: risk.createdAt,
        updated_at: risk.updatedAt,
      };

      // Filter to only include selected fields
      if (config.fields && config.fields.length > 0) {
        const selectedData: Record<string, any> = {};
        for (const field of config.fields) {
          if (fullData[field] !== undefined) {
            selectedData[field] = fullData[field];
          }
        }
        return selectedData;
      }

      return fullData;
    });

    // Generate summary if requested
    let summary: Record<string, any> | undefined;
    if (config.include_summary) {
      const scores = filteredRisks
        .map(r => r.current_risk_score)
        .filter((s): s is number => s !== null && s !== undefined);

      summary = {
        total_risks: filteredRisks.length,
        average_score: scores.length > 0 
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          : 0,
        max_score: scores.length > 0 ? Math.max(...scores) : 0,
        min_score: scores.length > 0 ? Math.min(...scores) : 0,
        by_level: {
          critical: filteredRisks.filter(r => r.current_risk_level === RiskLevel.CRITICAL).length,
          high: filteredRisks.filter(r => r.current_risk_level === RiskLevel.HIGH).length,
          medium: filteredRisks.filter(r => r.current_risk_level === RiskLevel.MEDIUM).length,
          low: filteredRisks.filter(r => r.current_risk_level === RiskLevel.LOW).length,
        },
        by_status: filteredRisks.reduce((acc, r) => {
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
    }

    // Group data if requested
    let groupedData: Record<string, any[]> | undefined;
    if (config.group_by) {
      groupedData = reportData.reduce((acc, item) => {
        const key = String(item[config.group_by!] || 'Unknown');
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, any[]>);
    }

    return {
      report_name: config.name,
      generated_at: new Date().toISOString(),
      filters_applied: {
        risk_levels: config.risk_levels,
        categories: config.categories,
        statuses: config.statuses,
        owner_ids: config.owner_ids,
        exceeds_appetite_only: config.exceeds_appetite_only,
        sort_by: config.sort_by,
        sort_direction: config.sort_direction,
        group_by: config.group_by,
      },
      data: groupedData ? [] : reportData,
      summary,
      grouped_data: groupedData,
    };
  }

  /**
   * Get available report fields
   */
  getAvailableReportFields(): { field: string; label: string; category: string }[] {
    return [
      // Identification
      { field: 'risk_id', label: 'Risk ID', category: 'Identification' },
      { field: 'title', label: 'Title', category: 'Identification' },
      { field: 'description', label: 'Description', category: 'Identification' },
      { field: 'risk_statement', label: 'Risk Statement', category: 'Identification' },
      { field: 'category_name', label: 'Category', category: 'Identification' },
      { field: 'status', label: 'Status', category: 'Identification' },
      
      // Ownership
      { field: 'owner_name', label: 'Owner', category: 'Ownership' },
      { field: 'analyst_name', label: 'Analyst', category: 'Ownership' },
      
      // Inherent Risk
      { field: 'inherent_likelihood', label: 'Inherent Likelihood', category: 'Inherent Risk' },
      { field: 'inherent_impact', label: 'Inherent Impact', category: 'Inherent Risk' },
      { field: 'inherent_risk_score', label: 'Inherent Score', category: 'Inherent Risk' },
      { field: 'inherent_risk_level', label: 'Inherent Level', category: 'Inherent Risk' },
      
      // Current Risk
      { field: 'current_likelihood', label: 'Current Likelihood', category: 'Current Risk' },
      { field: 'current_impact', label: 'Current Impact', category: 'Current Risk' },
      { field: 'current_risk_score', label: 'Current Score', category: 'Current Risk' },
      { field: 'current_risk_level', label: 'Current Level', category: 'Current Risk' },
      
      // Target Risk
      { field: 'target_likelihood', label: 'Target Likelihood', category: 'Target Risk' },
      { field: 'target_impact', label: 'Target Impact', category: 'Target Risk' },
      { field: 'target_risk_score', label: 'Target Score', category: 'Target Risk' },
      { field: 'target_risk_level', label: 'Target Level', category: 'Target Risk' },
      
      // Controls
      { field: 'control_effectiveness', label: 'Control Effectiveness', category: 'Controls' },
      { field: 'linked_controls_count', label: 'Linked Controls', category: 'Controls' },
      
      // Additional Info
      { field: 'threat_source', label: 'Threat Source', category: 'Additional' },
      { field: 'risk_velocity', label: 'Risk Velocity', category: 'Additional' },
      { field: 'linked_assets_count', label: 'Linked Assets', category: 'Additional' },
      { field: 'active_treatments_count', label: 'Active Treatments', category: 'Additional' },
      { field: 'kri_count', label: 'KRIs', category: 'Additional' },
      
      // Dates
      { field: 'date_identified', label: 'Date Identified', category: 'Dates' },
      { field: 'next_review_date', label: 'Next Review', category: 'Dates' },
      { field: 'last_review_date', label: 'Last Review', category: 'Dates' },
      { field: 'created_at', label: 'Created At', category: 'Dates' },
      { field: 'updated_at', label: 'Updated At', category: 'Dates' },
    ];
  }

  // Private helper methods

  private async getRiskLevelFromSettings(score: number, organizationId?: string): Promise<string> {
    try {
      const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, organizationId);
      return riskLevel?.level || this.getDefaultRiskLevel(score);
    } catch {
      return this.getDefaultRiskLevel(score);
    }
  }

  private getDefaultRiskLevel(score: number): string {
    if (score >= 20) return 'critical';
    if (score >= 12) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
  }

  private generateRecommendation(
    originalScore: number,
    simulatedScore: number,
    originalLevel: string,
    simulatedLevel: string,
    exceedsAppetite: boolean,
    request: WhatIfScenarioRequestDto,
  ): string {
    const recommendations: string[] = [];

    if (simulatedScore < originalScore) {
      const reduction = Math.round(((originalScore - simulatedScore) / originalScore) * 100);
      recommendations.push(`This scenario would reduce risk by ${reduction}%.`);
    } else if (simulatedScore > originalScore) {
      const increase = Math.round(((simulatedScore - originalScore) / originalScore) * 100);
      recommendations.push(`Warning: This scenario would increase risk by ${increase}%.`);
    }

    if (originalLevel !== simulatedLevel) {
      if (['critical', 'high'].includes(originalLevel) && ['medium', 'low'].includes(simulatedLevel)) {
        recommendations.push(`Risk level would improve from ${originalLevel} to ${simulatedLevel}.`);
      } else if (['medium', 'low'].includes(originalLevel) && ['critical', 'high'].includes(simulatedLevel)) {
        recommendations.push(`Warning: Risk level would worsen from ${originalLevel} to ${simulatedLevel}.`);
      }
    }

    if (exceedsAppetite) {
      recommendations.push('The simulated risk still exceeds organizational risk appetite. Additional controls or mitigation needed.');
    } else if (originalScore > 11 && simulatedScore <= 11) {
      recommendations.push('This scenario would bring the risk within acceptable appetite levels.');
    }

    if (request.additional_controls && request.additional_controls > 0) {
      recommendations.push(`Adding ${request.additional_controls} control(s) could achieve this result.`);
    }

    if (request.simulated_control_effectiveness && request.simulated_control_effectiveness > 50) {
      recommendations.push('Focus on improving control effectiveness through testing and monitoring.');
    }

    return recommendations.length > 0 
      ? recommendations.join(' ') 
      : 'No significant changes detected in this scenario.';
  }

  private async getIntegrationCounts(riskIds: string[]): Promise<Record<string, {
    linked_assets_count: number;
    linked_controls_count: number;
    active_treatments_count: number;
    kri_count: number;
  }>> {
    const result: Record<string, any> = {};
    riskIds.forEach(id => {
      result[id] = {
        linked_assets_count: 0,
        linked_controls_count: 0,
        active_treatments_count: 0,
        kri_count: 0,
      };
    });

    if (riskIds.length === 0) return result;

    // Count asset links
    const assetCounts = await this.assetLinkRepository
      .createQueryBuilder('link')
      .select('link.risk_id', 'risk_id')
      .addSelect('COUNT(*)', 'count')
      .where('link.risk_id IN (:...ids)', { ids: riskIds })
      .groupBy('link.risk_id')
      .getRawMany();

    assetCounts.forEach(row => {
      if (result[row.risk_id]) result[row.risk_id].linked_assets_count = parseInt(row.count);
    });

    // Count control links
    const controlCounts = await this.controlLinkRepository
      .createQueryBuilder('link')
      .select('link.risk_id', 'risk_id')
      .addSelect('COUNT(*)', 'count')
      .where('link.risk_id IN (:...ids)', { ids: riskIds })
      .groupBy('link.risk_id')
      .getRawMany();

    controlCounts.forEach(row => {
      if (result[row.risk_id]) result[row.risk_id].linked_controls_count = parseInt(row.count);
    });

    // Count active treatments
    const treatmentCounts = await this.treatmentRepository
      .createQueryBuilder('treatment')
      .select('treatment.risk_id', 'risk_id')
      .addSelect('COUNT(*)', 'count')
      .where('treatment.risk_id IN (:...ids)', { ids: riskIds })
      .andWhere('treatment.status IN (:...statuses)', { statuses: ['planned', 'in_progress'] })
      .andWhere('treatment.deleted_at IS NULL')
      .groupBy('treatment.risk_id')
      .getRawMany();

    treatmentCounts.forEach(row => {
      if (result[row.risk_id]) result[row.risk_id].active_treatments_count = parseInt(row.count);
    });

    // Count KRI links
    const kriCounts = await this.kriLinkRepository
      .createQueryBuilder('link')
      .select('link.risk_id', 'risk_id')
      .addSelect('COUNT(*)', 'count')
      .where('link.risk_id IN (:...ids)', { ids: riskIds })
      .groupBy('link.risk_id')
      .getRawMany();

    kriCounts.forEach(row => {
      if (result[row.risk_id]) result[row.risk_id].kri_count = parseInt(row.count);
    });

    return result;
  }
}




