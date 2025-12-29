import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, LessThan, IsNull, Not } from 'typeorm';
import { Risk, RiskStatus, RiskImpact, RiskLikelihood, RiskLevel } from '../entities/risk.entity';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';
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
import { TenantContextService } from '../../common/context/tenant-context.service';

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
    private tenantContextService: TenantContextService,
  ) { }

  async findAll(query?: RiskQueryDto): Promise<{ data: RiskResponseDto[]; total: number; page: number; limit: number }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    let queryBuilder = this.riskRepository.createQueryBuilder('risk')
      .leftJoinAndSelect('risk.owner', 'owner')
      .leftJoinAndSelect('risk.riskCategory', 'riskCategory')
      .leftJoinAndSelect('risk.riskAnalyst', 'riskAnalyst')
      .where('risk.deletedAt IS NULL');

    // Apply search filter
    if (query?.search) {
      queryBuilder.andWhere(
        '(risk.title ILIKE :search OR risk.description ILIKE :search OR risk.riskId ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Apply filters
    if (query?.status) {
      queryBuilder.andWhere('risk.status = :status', { status: query.status });
    }
    if (query?.category_id) {
      queryBuilder.andWhere('risk.categoryId = :category_id', { category_id: query.category_id });
    }
    if (query?.likelihood !== undefined) {
      queryBuilder.andWhere('risk.likelihood = :likelihood', { likelihood: query.likelihood });
    }
    if (query?.impact !== undefined) {
      queryBuilder.andWhere('risk.impact = :impact', { impact: query.impact });
    }
    if (query?.current_risk_level) {
      queryBuilder.andWhere('risk.currentRiskLevel = :level', { level: query.current_risk_level });
    }
    if (query?.ownerId) {
      queryBuilder.andWhere('risk.ownerId = :ownerId', { ownerId: query.ownerId });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const risks = await queryBuilder
      .orderBy('risk.currentRiskScore', 'DESC', 'NULLS LAST')
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
      relations: ['owner', 'riskCategory', 'riskSubCategory', 'riskAnalyst'],
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
      riskStatement: createRiskDto.risk_statement,
      categoryId: createRiskDto.category_id,
      subCategoryId: createRiskDto.sub_category_id,
      status: createRiskDto.status || RiskStatus.IDENTIFIED,
      likelihood: createRiskDto.likelihood || RiskLikelihood.MEDIUM,
      impact: createRiskDto.impact || RiskImpact.MEDIUM,
      dateIdentified: createRiskDto.date_identified ? new Date(createRiskDto.date_identified) : new Date(),
      threatSource: createRiskDto.threat_source as any,
      riskVelocity: createRiskDto.risk_velocity as any,
      earlyWarningSigns: createRiskDto.early_warning_signs,
      statusNotes: createRiskDto.status_notes,
      businessProcess: createRiskDto.business_process,
      tags: createRiskDto.tags,
      businessUnitIds: createRiskDto.business_unit_ids,
      nextReviewDate: createRiskDto.next_review_date ? new Date(createRiskDto.next_review_date) : undefined,
      inherentLikelihood: createRiskDto.inherent_likelihood,
      inherentImpact: createRiskDto.inherent_impact,
      currentLikelihood: createRiskDto.current_likelihood,
      currentImpact: createRiskDto.current_impact,
      targetLikelihood: createRiskDto.target_likelihood,
      targetImpact: createRiskDto.target_impact,
      tenantId: organizationId || this.tenantContextService.getTenantId(),
      ownerId: createRiskDto.ownerId || userId,
      createdBy: userId,
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
          likelihood: savedRisk.likelihood,
          impact: savedRisk.impact,
          current_risk_level: savedRisk.currentRiskLevel,
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
    const oldRiskLevel = risk.currentRiskLevel;

    // Handle mapping
    const { date_identified, next_review_date, risk_statement, category_id, sub_category_id, risk_analyst_id, threat_source, risk_velocity, early_warning_signs, status_notes, business_process, business_unit_ids, inherent_likelihood, inherent_impact, current_likelihood, current_impact, target_likelihood, target_impact, ...rest } = updateRiskDto as any;

    const updateData: any = { ...rest, updatedBy: userId };
    if (date_identified) updateData.dateIdentified = new Date(date_identified);
    if (next_review_date) updateData.nextReviewDate = new Date(next_review_date);
    if (risk_statement) updateData.riskStatement = risk_statement;
    if (category_id) updateData.categoryId = category_id;
    if (sub_category_id) updateData.subCategoryId = sub_category_id;
    if (risk_analyst_id) updateData.riskAnalystId = risk_analyst_id;
    if (threat_source) updateData.threatSource = threat_source;
    if (risk_velocity) updateData.riskVelocity = risk_velocity;
    if (early_warning_signs) updateData.earlyWarningSigns = early_warning_signs;
    if (status_notes) updateData.statusNotes = status_notes;
    if (business_process) updateData.businessProcess = business_process;
    if (business_unit_ids) updateData.businessUnitIds = business_unit_ids;
    if (inherent_likelihood) updateData.inherentLikelihood = inherent_likelihood;
    if (inherent_impact) updateData.inherentImpact = inherent_impact;
    if (current_likelihood) updateData.currentLikelihood = current_likelihood;
    if (current_impact) updateData.currentImpact = current_impact;
    if (target_likelihood) updateData.targetLikelihood = target_likelihood;
    if (target_impact) updateData.targetImpact = target_impact;

    Object.assign(risk, updateData);
    risk.versionNumber = (risk.versionNumber || 1) + 1;

    const updatedRisk = await this.riskRepository.save(risk);

    // Trigger workflows
    try {
      await this.workflowService.checkAndTriggerWorkflows(
        EntityType.RISK,
        updatedRisk.id,
        WorkflowTrigger.ON_UPDATE,
        {
          status: updatedRisk.status,
          likelihood: updatedRisk.likelihood,
          impact: updatedRisk.impact,
          current_risk_level: updatedRisk.currentRiskLevel,
        },
      );

      // Trigger status change workflow if status changed
      if (oldStatus !== updatedRisk.status) {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.RISK,
          updatedRisk.id,
          WorkflowTrigger.ON_STATUS_CHANGE,
          { oldStatus, newStatus: updatedRisk.status },
        );
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
      where: { deletedAt: IsNull() },
    });

    const heatmapMap = new Map<string, { count: number; riskIds: string[]; riskLevel: RiskLevel }>();
    let maxRiskScore = 0;

    risks.forEach((risk) => {
      const likelihood = risk.currentLikelihood || Number(risk.likelihood) || 3;
      const impact = risk.currentImpact || Number(risk.impact) || 3;
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
    const tenantId = organizationId || this.tenantContextService.getTenantId();

    const risks = await this.riskRepository.find({
      where: { deletedAt: IsNull() },
    });

    // Get risk settings for appetite threshold
    let maxAcceptableScore = 11;
    let riskAppetiteEnabled = true;
    try {
      const settings = await this.riskSettingsService.getSettings(tenantId);
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
      switch (risk.currentRiskLevel) {
        case RiskLevel.CRITICAL: critical++; break;
        case RiskLevel.HIGH: high++; break;
        case RiskLevel.MEDIUM: medium++; break;
        case RiskLevel.LOW: low++; break;
      }

      if (risk.nextReviewDate && new Date(risk.nextReviewDate) < today) {
        overdueReviews++;
      }

      // Check if risk exceeds appetite threshold
      if (riskAppetiteEnabled && risk.currentRiskScore && risk.currentRiskScore > maxAcceptableScore) {
        risksExceedingAppetite++;
      }
    }

    // Count active treatments
    const activeTreatments = await this.treatmentRepository.count({
      where: {
        status: In([TreatmentStatus.PLANNED, TreatmentStatus.IN_PROGRESS]),
        deletedAt: IsNull(),
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
      where: { deletedAt: IsNull() },
      relations: ['owner', 'riskCategory'],
      order: { currentRiskScore: 'DESC' },
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
        { nextReviewDate: LessThan(futureDate), deletedAt: IsNull() },
      ],
      relations: ['owner', 'riskCategory'],
      order: { nextReviewDate: 'ASC' },
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
      .select('link.riskId', 'risk_id')
      .addSelect('COUNT(*)', 'count')
      .where('link.riskId IN (:...ids)', { ids: riskIds })
      .groupBy('link.riskId')
      .getRawMany();

    assetCounts.forEach(row => {
      if (result[row.risk_id]) result[row.risk_id].linked_assets_count = parseInt(row.count);
    });

    // Count control links
    const controlCounts = await this.controlLinkRepository
      .createQueryBuilder('link')
      .select('link.riskId', 'risk_id')
      .addSelect('COUNT(*)', 'count')
      .where('link.riskId IN (:...ids)', { ids: riskIds })
      .groupBy('link.riskId')
      .getRawMany();

    controlCounts.forEach(row => {
      if (result[row.risk_id]) result[row.risk_id].linked_controls_count = parseInt(row.count);
    });

    // Count active treatments
    const treatmentCounts = await this.treatmentRepository
      .createQueryBuilder('treatment')
      .select('treatment.riskId', 'risk_id')
      .addSelect('COUNT(*)', 'count')
      .where('treatment.riskId IN (:...ids)', { ids: riskIds })
      .andWhere('treatment.status IN (:...statuses)', { statuses: ['planned', 'in_progress'] })
      .andWhere('treatment.deletedAt IS NULL')
      .groupBy('treatment.riskId')
      .getRawMany();

    treatmentCounts.forEach(row => {
      if (result[row.risk_id]) result[row.risk_id].active_treatments_count = parseInt(row.count);
    });

    // Count KRI links
    const kriCounts = await this.kriLinkRepository
      .createQueryBuilder('link')
      .select('link.riskId', 'risk_id')
      .addSelect('COUNT(*)', 'count')
      .where('link.riskId IN (:...ids)', { ids: riskIds })
      .groupBy('link.riskId')
      .getRawMany();

    kriCounts.forEach(row => {
      if (result[row.risk_id]) result[row.risk_id].kri_count = parseInt(row.count);
    });

    return result;
  }

  async checkRiskAppetite(score: number, organizationId?: string): Promise<{
    exceeds: boolean;
    maxAcceptable: number;
    requiresEscalation: boolean;
  }> {
    const tenantId = organizationId || this.tenantContextService.getTenantId();
    try {
      const settings = await this.riskSettingsService.getSettings(tenantId);
      const exceeds = settings.enable_risk_appetite && score > settings.max_acceptable_risk_score;

      // Check if this risk level requires escalation
      const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, tenantId);

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
    const toISOString = (date: any): string | undefined => {
      if (!date) return undefined;
      return (date instanceof Date ? date.toISOString() : new Date(date).toISOString());
    };

    return {
      id: risk.id,
      risk_id: risk.riskId,
      title: risk.title,
      description: risk.description,
      risk_statement: risk.riskStatement,
      category: risk.category,
      status: risk.status,
      likelihood: risk.likelihood,
      impact: risk.impact,
      ownerId: risk.ownerId,
      owner_name: risk.owner
        ? `${risk.owner.firstName || ''} ${risk.owner.lastName || ''}`.trim()
        : undefined,
      risk_analyst_id: risk.riskAnalystId,
      risk_analyst_name: risk.riskAnalyst
        ? `${risk.riskAnalyst.firstName || ''} ${risk.riskAnalyst.lastName || ''}`.trim()
        : undefined,
      date_identified: toISOString(risk.dateIdentified),
      next_review_date: toISOString(risk.nextReviewDate),
      last_review_date: toISOString(risk.lastReviewDate),
      threat_source: risk.threatSource as any,
      risk_velocity: risk.riskVelocity as any,
      early_warning_signs: risk.earlyWarningSigns,
      status_notes: risk.statusNotes,
      business_process: risk.businessProcess,
      tags: risk.tags,
      business_unit_ids: risk.businessUnitIds,
      version_number: risk.versionNumber,
      inherent_likelihood: risk.inherentLikelihood,
      inherent_impact: risk.inherentImpact,
      inherent_risk_score: risk.inherentRiskScore,
      inherent_risk_level: risk.inherentRiskLevel as any,
      current_likelihood: risk.currentLikelihood,
      current_impact: risk.currentImpact,
      current_risk_score: risk.currentRiskScore,
      current_risk_level: risk.currentRiskLevel as any,
      target_likelihood: risk.targetLikelihood,
      target_impact: risk.targetImpact,
      target_risk_score: risk.targetRiskScore,
      target_risk_level: risk.targetRiskLevel as any,
      control_effectiveness: risk.controlEffectiveness,
      linked_assets_count: counts?.linked_assets_count,
      linked_controls_count: counts?.linked_controls_count,
      active_treatments_count: counts?.active_treatments_count,
      kri_count: counts?.kri_count,
      // Risk appetite warnings from settings
      exceeds_risk_appetite: riskAppetiteInfo?.exceeds_risk_appetite,
      requires_escalation: riskAppetiteInfo?.requires_escalation,
      recommended_response_time: riskAppetiteInfo?.recommended_response_time,
      risk_level_color: riskAppetiteInfo?.risk_level_color,
      createdAt: toISOString(risk.createdAt),
      updatedAt: toISOString(risk.updatedAt),
      tenant_id: (risk as any).tenantId,
    };
  }

  private async enrichWithRiskAppetite(risk: Risk, organizationId?: string): Promise<{
    exceeds_risk_appetite?: boolean;
    requires_escalation?: boolean;
    recommended_response_time?: string;
    risk_level_color?: string;
  }> {
    const tenantId = organizationId || this.tenantContextService.getTenantId();
    const score = risk.currentRiskScore || (risk.currentLikelihood && risk.currentImpact ? risk.currentLikelihood * risk.currentImpact : null);

    if (!score) {
      return {};
    }

    try {
      const settings = await this.riskSettingsService.getSettings(tenantId);
      const riskLevel = await this.riskSettingsService.getRiskLevelForScore(score, tenantId);

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

  async getRisksExceedingAppetite(organizationId?: string): Promise<RiskResponseDto[]> {
    const tenantId = organizationId || this.tenantContextService.getTenantId();
    try {
      const settings = await this.riskSettingsService.getSettings(tenantId);

      if (!settings.enable_risk_appetite) {
        return [];
      }

      const risks = await this.riskRepository
        .createQueryBuilder('risk')
        .leftJoinAndSelect('risk.owner', 'owner')
        .leftJoinAndSelect('risk.riskCategory', 'riskCategory')
        .where('risk.deletedAt IS NULL')
        .andWhere('risk.currentRiskScore > :threshold', { threshold: settings.max_acceptable_risk_score })
        .orderBy('risk.currentRiskScore', 'DESC')
        .getMany();

      const riskIds = risks.map(r => r.id);
      const counts = await this.getIntegrationCounts(riskIds);

      return Promise.all(risks.map(async (risk) => {
        const appetiteInfo = await this.enrichWithRiskAppetite(risk, tenantId);
        return this.toResponseDto(risk, counts[risk.id], appetiteInfo);
      }));
    } catch (error) {
      console.error('Error getting risks exceeding appetite:', error);
      return [];
    }
  }

  private calculateRiskLevelDefault(score: number): RiskLevel {
    if (score >= 20) return RiskLevel.CRITICAL;
    if (score >= 12) return RiskLevel.HIGH;
    if (score >= 6) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  private calculateRiskLevel(score: number): RiskLevel {
    return this.calculateRiskLevelDefault(score);
  }
}
