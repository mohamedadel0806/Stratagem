import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, LessThan, IsNull, Not } from 'typeorm';
import { Risk, RiskStatus, RiskLikelihood, RiskImpact, RiskLevel } from '../entities/risk.entity';
import { RiskAssetLink } from '../entities/risk-asset-link.entity';
import { RiskControlLink } from '../entities/risk-control-link.entity';
import { RiskTreatment, TreatmentStatus } from '../entities/risk-treatment.entity';
import { KRIRiskLink } from '../entities/kri-risk-link.entity';
import { RiskResponseDto, RiskDashboardSummaryDto } from '../dto/risk-response.dto';
import { CreateRiskDto } from '../dto/create-risk.dto';
import { UpdateRiskDto } from '../dto/update-risk.dto';
import { RiskQueryDto } from '../dto/risk-query.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { EntityType, WorkflowTrigger } from '../../workflow/entities/workflow.entity';
import { RiskSettingsService } from './risk-settings.service';

@Injectable()
export class RiskService {
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
    @Inject(forwardRef(() => WorkflowService))
    private workflowService: WorkflowService,
    private riskSettingsService: RiskSettingsService,
  ) {}

  async findAll(query?: RiskQueryDto): Promise<{ data: RiskResponseDto[]; total: number; page: number; limit: number }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    let queryBuilder = this.riskRepository.createQueryBuilder('risk')
      .leftJoinAndSelect('risk.owner', 'owner')
      .leftJoinAndSelect('risk.risk_category', 'risk_category')
      .leftJoinAndSelect('risk.risk_analyst', 'risk_analyst')
      .where('risk.deleted_at IS NULL');

    // Apply search filter
    if (query?.search) {
      queryBuilder.andWhere(
        '(risk.title ILIKE :search OR risk.description ILIKE :search OR risk.risk_id ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Apply filters
    if (query?.status) {
      queryBuilder.andWhere('risk.status = :status', { status: query.status });
    }
    if (query?.category) {
      queryBuilder.andWhere('risk.category = :category', { category: query.category });
    }
    if (query?.category_id) {
      queryBuilder.andWhere('risk.category_id = :category_id', { category_id: query.category_id });
    }
    if (query?.likelihood !== undefined) {
      queryBuilder.andWhere('risk.likelihood = :likelihood', { likelihood: query.likelihood });
    }
    if (query?.impact !== undefined) {
      queryBuilder.andWhere('risk.impact = :impact', { impact: query.impact });
    }
    if (query?.current_risk_level) {
      queryBuilder.andWhere('risk.current_risk_level = :level', { level: query.current_risk_level });
    }
    if (query?.ownerId) {
      queryBuilder.andWhere('risk.ownerId = :ownerId', { ownerId: query.ownerId });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const risks = await queryBuilder
      .orderBy('risk.current_risk_score', 'DESC', 'NULLS LAST')
      .addOrderBy('risk.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    // Get integration counts for each risk
    const riskIds = risks.map(r => r.id);
    const counts = await this.getIntegrationCounts(riskIds);

    return {
      data: risks.map((risk) => this.toResponseDto(risk, counts[risk.id])),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, organizationId?: string): Promise<RiskResponseDto> {
    const risk = await this.riskRepository.findOne({
      where: { id },
      relations: ['owner', 'risk_category', 'risk_sub_category', 'risk_analyst'],
    });

    if (!risk) {
      throw new NotFoundException(`Risk with ID ${id} not found`);
    }

    const counts = await this.getIntegrationCounts([id]);
    const appetiteInfo = await this.enrichWithRiskAppetite(risk, organizationId);
    return this.toResponseDto(risk, counts[id], appetiteInfo);
  }

  async create(createRiskDto: CreateRiskDto, userId?: string, organizationId?: string): Promise<RiskResponseDto> {
    const riskData: Partial<Risk> = {
      title: createRiskDto.title,
      description: createRiskDto.description,
      risk_statement: createRiskDto.risk_statement,
      category: createRiskDto.category,
      category_id: createRiskDto.category_id,
      sub_category_id: createRiskDto.sub_category_id,
      status: createRiskDto.status || RiskStatus.IDENTIFIED,
      likelihood: createRiskDto.likelihood || RiskLikelihood.MEDIUM,
      impact: createRiskDto.impact || RiskImpact.MEDIUM,
      ownerId: createRiskDto.ownerId || userId,
      risk_analyst_id: createRiskDto.risk_analyst_id,
      date_identified: createRiskDto.date_identified ? new Date(createRiskDto.date_identified) : new Date(),
      threat_source: createRiskDto.threat_source,
      risk_velocity: createRiskDto.risk_velocity,
      early_warning_signs: createRiskDto.early_warning_signs,
      status_notes: createRiskDto.status_notes,
      business_process: createRiskDto.business_process,
      tags: createRiskDto.tags,
      business_unit_ids: createRiskDto.business_unit_ids,
      next_review_date: createRiskDto.next_review_date ? new Date(createRiskDto.next_review_date) : undefined,
      inherent_likelihood: createRiskDto.inherent_likelihood,
      inherent_impact: createRiskDto.inherent_impact,
      current_likelihood: createRiskDto.current_likelihood,
      current_impact: createRiskDto.current_impact,
      target_likelihood: createRiskDto.target_likelihood,
      target_impact: createRiskDto.target_impact,
      // Only set organizationId if provided, otherwise leave it undefined (will be NULL in DB)
      ...(organizationId && { organizationId }),
      created_by: userId,
    };

    const risk = this.riskRepository.create(riskData);
    const savedRisk = await this.riskRepository.save(risk);

    // Trigger workflows on create
    try {
      await this.workflowService.checkAndTriggerWorkflows(
        EntityType.RISK,
        savedRisk.id,
        WorkflowTrigger.ON_CREATE,
        { 
          status: savedRisk.status, 
          category: savedRisk.category, 
          likelihood: savedRisk.likelihood, 
          impact: savedRisk.impact,
          current_risk_level: savedRisk.current_risk_level,
        },
      );
    } catch (error) {
      console.error('Error triggering workflows:', error);
    }

    return this.toResponseDto(savedRisk);
  }

  async update(id: string, updateRiskDto: UpdateRiskDto, userId?: string): Promise<RiskResponseDto> {
    const risk = await this.riskRepository.findOne({ where: { id } });
    if (!risk) {
      throw new NotFoundException(`Risk with ID ${id} not found`);
    }

    const oldStatus = risk.status;
    const oldRiskLevel = risk.current_risk_level;

    // Handle date conversions
    const updateData: any = { ...updateRiskDto, updated_by: userId };
    if (updateRiskDto.date_identified) updateData.date_identified = new Date(updateRiskDto.date_identified);
    if (updateRiskDto.next_review_date) updateData.next_review_date = new Date(updateRiskDto.next_review_date);

    Object.assign(risk, updateData);
    risk.version_number = (risk.version_number || 1) + 1;
    
    const updatedRisk = await this.riskRepository.save(risk);

    // Trigger workflows
    try {
      await this.workflowService.checkAndTriggerWorkflows(
        EntityType.RISK,
        updatedRisk.id,
        WorkflowTrigger.ON_UPDATE,
        { 
          status: updatedRisk.status, 
          category: updatedRisk.category, 
          likelihood: updatedRisk.likelihood, 
          impact: updatedRisk.impact,
          current_risk_level: updatedRisk.current_risk_level,
        },
      );

      // Trigger status change workflow if status changed
      if (oldStatus !== updatedRisk.status) {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.RISK,
          updatedRisk.id,
          WorkflowTrigger.ON_STATUS_CHANGE,
          { oldStatus, newStatus: updatedRisk.status, category: updatedRisk.category },
        );
      }

      // Could add trigger for risk level change
      if (oldRiskLevel !== updatedRisk.current_risk_level) {
        // TODO: Add ON_RISK_LEVEL_CHANGE workflow trigger
      }
    } catch (error) {
      console.error('Error triggering workflows:', error);
    }

    const counts = await this.getIntegrationCounts([id]);
    return this.toResponseDto(updatedRisk, counts[id]);
  }

  async remove(id: string): Promise<void> {
    const risk = await this.riskRepository.findOne({ where: { id } });
    if (!risk) {
      throw new NotFoundException(`Risk with ID ${id} not found`);
    }
    // Soft delete
    await this.riskRepository.softDelete(id);
  }

  async bulkUpdateStatus(ids: string[], status: RiskStatus): Promise<{ updated: number; risks: RiskResponseDto[] }> {
    const risks = await this.riskRepository.find({
      where: { id: In(ids) },
    });

    if (risks.length === 0) {
      throw new NotFoundException('No risks found with the provided IDs');
    }

    risks.forEach(risk => {
      risk.status = status;
    });

    const updatedRisks = await this.riskRepository.save(risks);

    return {
      updated: updatedRisks.length,
      risks: updatedRisks.map(risk => this.toResponseDto(risk)),
    };
  }

  async getHeatmapData() {
    const risks = await this.riskRepository.find({
      where: { deleted_at: IsNull() },
    });
    
    const heatmapMap = new Map<string, { count: number; riskIds: string[]; riskLevel: RiskLevel }>();
    let maxRiskScore = 0;

    risks.forEach((risk) => {
      const likelihood = risk.current_likelihood || Number(risk.likelihood) || 3;
      const impact = risk.current_impact || Number(risk.impact) || 3;
      const riskScore = likelihood * impact;
      maxRiskScore = Math.max(maxRiskScore, riskScore);

      const key = `${likelihood}-${impact}`;
      if (!heatmapMap.has(key)) {
        heatmapMap.set(key, { 
          count: 0, 
          riskIds: [],
          riskLevel: this.calculateRiskLevel(riskScore),
        });
      }
      const cell = heatmapMap.get(key)!;
      cell.count++;
      cell.riskIds.push(risk.id);
    });

    const cells = Array.from(heatmapMap.entries()).map(([key, data]) => {
      const [likelihood, impact] = key.split('-').map(Number);
      return {
        likelihood,
        impact,
        count: data.count,
        riskScore: likelihood * impact,
        riskIds: data.riskIds,
        riskLevel: data.riskLevel,
      };
    });

    return {
      cells,
      totalRisks: risks.length,
      maxRiskScore,
    };
  }

  async getDashboardSummary(organizationId?: string): Promise<RiskDashboardSummaryDto> {
    const risks = await this.riskRepository.find({
      where: { deleted_at: IsNull() },
    });

    // Get risk settings for appetite threshold
    let maxAcceptableScore = 11;
    let riskAppetiteEnabled = true;
    try {
      const settings = await this.riskSettingsService.getSettings(organizationId);
      maxAcceptableScore = settings.max_acceptable_risk_score;
      riskAppetiteEnabled = settings.enable_risk_appetite;
    } catch (error) {
      console.warn('Failed to get risk settings for dashboard:', error.message);
    }

    const today = new Date();
    let critical = 0, high = 0, medium = 0, low = 0;
    let overdueReviews = 0;
    let risksExceedingAppetite = 0;

    for (const risk of risks) {
      switch (risk.current_risk_level) {
        case RiskLevel.CRITICAL: critical++; break;
        case RiskLevel.HIGH: high++; break;
        case RiskLevel.MEDIUM: medium++; break;
        case RiskLevel.LOW: low++; break;
      }

      if (risk.next_review_date && new Date(risk.next_review_date) < today) {
        overdueReviews++;
      }

      // Check if risk exceeds appetite threshold
      if (riskAppetiteEnabled && risk.current_risk_score && risk.current_risk_score > maxAcceptableScore) {
        risksExceedingAppetite++;
      }
    }

    // Count active treatments
    const activeTreatments = await this.treatmentRepository.count({
      where: {
        status: In([TreatmentStatus.PLANNED, TreatmentStatus.IN_PROGRESS]),
        deleted_at: IsNull(),
      },
    });

    // Count KRIs by status
    const kriLinks = await this.kriLinkRepository.find({
      relations: ['kri'],
    });
    let kriRed = 0, kriAmber = 0;
    for (const link of kriLinks) {
      if (link.kri?.current_status === 'red') kriRed++;
      else if (link.kri?.current_status === 'amber') kriAmber++;
    }

    return {
      total_risks: risks.length,
      critical_risks: critical,
      high_risks: high,
      medium_risks: medium,
      low_risks: low,
      risks_exceeding_appetite: risksExceedingAppetite,
      max_acceptable_score: maxAcceptableScore,
      risk_appetite_enabled: riskAppetiteEnabled,
      overdue_reviews: overdueReviews,
      active_treatments: activeTreatments,
      kri_red_count: kriRed,
      kri_amber_count: kriAmber,
    };
  }

  async getTopRisks(limit = 10): Promise<RiskResponseDto[]> {
    const risks = await this.riskRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['owner', 'risk_category'],
      order: { current_risk_score: 'DESC' },
      take: limit,
    });

    const riskIds = risks.map(r => r.id);
    const counts = await this.getIntegrationCounts(riskIds);

    return risks.map(risk => this.toResponseDto(risk, counts[risk.id]));
  }

  async getRisksNeedingReview(days = 7): Promise<RiskResponseDto[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const risks = await this.riskRepository.find({
      where: [
        { next_review_date: LessThan(futureDate), deleted_at: IsNull() },
      ],
      relations: ['owner', 'risk_category'],
      order: { next_review_date: 'ASC' },
    });

    return risks.map(risk => this.toResponseDto(risk));
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

  /**
   * Calculate risk level based on organization settings
   * Falls back to hardcoded defaults if settings unavailable
   */
  private async calculateRiskLevelFromSettings(score: number, organizationId?: string): Promise<RiskLevel> {
    try {
      const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, organizationId);
      if (riskLevel) {
        return riskLevel.level as RiskLevel;
      }
    } catch (error) {
      console.warn('Failed to get risk level from settings, using defaults:', error.message);
    }
    // Fallback to hardcoded defaults
    return this.calculateRiskLevelDefault(score);
  }

  /**
   * Default risk level calculation (fallback)
   */
  private calculateRiskLevelDefault(score: number): RiskLevel {
    if (score >= 20) return RiskLevel.CRITICAL;
    if (score >= 12) return RiskLevel.HIGH;
    if (score >= 6) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  /**
   * Synchronous version for heatmap (uses defaults)
   */
  private calculateRiskLevel(score: number): RiskLevel {
    return this.calculateRiskLevelDefault(score);
  }

  /**
   * Check if a risk exceeds the organization's risk appetite
   */
  async checkRiskAppetite(score: number, organizationId?: string): Promise<{
    exceeds: boolean;
    maxAcceptable: number;
    requiresEscalation: boolean;
  }> {
    try {
      const settings = await this.riskSettingsService.getSettings(organizationId);
      const exceeds = settings.enable_risk_appetite && score > settings.max_acceptable_risk_score;
      
      // Check if this risk level requires escalation
      const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, organizationId);
      
      return {
        exceeds,
        maxAcceptable: settings.max_acceptable_risk_score,
        requiresEscalation: riskLevel?.escalation || false,
      };
    } catch (error) {
      console.warn('Failed to check risk appetite:', error.message);
      return {
        exceeds: false,
        maxAcceptable: 11,
        requiresEscalation: false,
      };
    }
  }

  private toResponseDto(risk: Risk, counts?: {
    linked_assets_count: number;
    linked_controls_count: number;
    active_treatments_count: number;
    kri_count: number;
  }, riskAppetiteInfo?: {
    exceeds_risk_appetite?: boolean;
    requires_escalation?: boolean;
    recommended_response_time?: string;
    risk_level_color?: string;
  }): RiskResponseDto {
    return {
      id: risk.id,
      risk_id: risk.risk_id,
      title: risk.title,
      description: risk.description,
      risk_statement: risk.risk_statement,
      category: risk.category,
      category_id: risk.category_id,
      category_name: risk.risk_category?.name,
      sub_category_id: risk.sub_category_id,
      sub_category_name: risk.risk_sub_category?.name,
      status: risk.status,
      likelihood: risk.likelihood,
      impact: risk.impact,
      ownerId: risk.ownerId,
      owner_name: risk.owner 
        ? `${risk.owner.firstName || ''} ${risk.owner.lastName || ''}`.trim() 
        : undefined,
      risk_analyst_id: risk.risk_analyst_id,
      risk_analyst_name: risk.risk_analyst
        ? `${risk.risk_analyst.firstName || ''} ${risk.risk_analyst.lastName || ''}`.trim()
        : undefined,
      date_identified: risk.date_identified ? (risk.date_identified instanceof Date ? risk.date_identified.toISOString() : new Date(risk.date_identified).toISOString()) : undefined,
      next_review_date: risk.next_review_date ? (risk.next_review_date instanceof Date ? risk.next_review_date.toISOString() : new Date(risk.next_review_date).toISOString()) : undefined,
      last_review_date: risk.last_review_date ? (risk.last_review_date instanceof Date ? risk.last_review_date.toISOString() : new Date(risk.last_review_date).toISOString()) : undefined,
      threat_source: risk.threat_source,
      risk_velocity: risk.risk_velocity,
      early_warning_signs: risk.early_warning_signs,
      status_notes: risk.status_notes,
      business_process: risk.business_process,
      tags: risk.tags,
      business_unit_ids: risk.business_unit_ids,
      version_number: risk.version_number,
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
      linked_assets_count: counts?.linked_assets_count,
      linked_controls_count: counts?.linked_controls_count,
      active_treatments_count: counts?.active_treatments_count,
      kri_count: counts?.kri_count,
      // Risk appetite warnings from settings
      exceeds_risk_appetite: riskAppetiteInfo?.exceeds_risk_appetite,
      requires_escalation: riskAppetiteInfo?.requires_escalation,
      recommended_response_time: riskAppetiteInfo?.recommended_response_time,
      risk_level_color: riskAppetiteInfo?.risk_level_color,
      createdAt: risk.createdAt ? (risk.createdAt instanceof Date ? risk.createdAt.toISOString() : new Date(risk.createdAt).toISOString()) : undefined,
      updatedAt: risk.updatedAt ? (risk.updatedAt instanceof Date ? risk.updatedAt.toISOString() : new Date(risk.updatedAt).toISOString()) : undefined,
    };
  }

  /**
   * Enrich a risk response with settings-based appetite warnings
   */
  private async enrichWithRiskAppetite(risk: Risk, organizationId?: string): Promise<{
    exceeds_risk_appetite?: boolean;
    requires_escalation?: boolean;
    recommended_response_time?: string;
    risk_level_color?: string;
  }> {
    const score = risk.current_risk_score || (risk.current_likelihood && risk.current_impact ? risk.current_likelihood * risk.current_impact : null);
    
    if (!score) {
      return {};
    }

    try {
      const settings = await this.riskSettingsService.getSettings(organizationId);
      const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, organizationId);
      
      return {
        exceeds_risk_appetite: settings.enable_risk_appetite && score > settings.max_acceptable_risk_score,
        requires_escalation: riskLevel?.escalation || false,
        recommended_response_time: riskLevel?.responseTime,
        risk_level_color: riskLevel?.color,
      };
    } catch (error) {
      console.warn('Failed to enrich with risk appetite:', error.message);
      return {};
    }
  }

  /**
   * Get risks exceeding risk appetite
   */
  async getRisksExceedingAppetite(organizationId?: string): Promise<RiskResponseDto[]> {
    try {
      const settings = await this.riskSettingsService.getSettings(organizationId);
      
      if (!settings.enable_risk_appetite) {
        return [];
      }

      const risks = await this.riskRepository
        .createQueryBuilder('risk')
        .leftJoinAndSelect('risk.owner', 'owner')
        .leftJoinAndSelect('risk.risk_category', 'risk_category')
        .where('risk.deleted_at IS NULL')
        .andWhere('risk.current_risk_score > :threshold', { threshold: settings.max_acceptable_risk_score })
        .orderBy('risk.current_risk_score', 'DESC')
        .getMany();

      const riskIds = risks.map(r => r.id);
      const counts = await this.getIntegrationCounts(riskIds);

      return Promise.all(risks.map(async (risk) => {
        const appetiteInfo = await this.enrichWithRiskAppetite(risk, organizationId);
        return this.toResponseDto(risk, counts[risk.id], appetiteInfo);
      }));
    } catch (error) {
      console.error('Error getting risks exceeding appetite:', error);
      return [];
    }
  }
}
