import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskAssessment, AssessmentType } from '../entities/risk-assessment.entity';
import { Risk, RiskLevel } from '../entities/risk.entity';
import { CreateRiskAssessmentDto } from '../dto/assessment/create-risk-assessment.dto';
import { RiskAssessmentResponseDto } from '../dto/assessment/risk-assessment-response.dto';
import { RiskSettingsService } from './risk-settings.service';

@Injectable()
export class RiskAssessmentService {
  constructor(
    @InjectRepository(RiskAssessment)
    private assessmentRepository: Repository<RiskAssessment>,
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
    private riskSettingsService: RiskSettingsService,
  ) {}

  async findByRiskId(riskId: string, assessmentType?: AssessmentType): Promise<RiskAssessmentResponseDto[]> {
    const where: any = { risk_id: riskId };
    if (assessmentType) {
      where.assessment_type = assessmentType;
    }

    const assessments = await this.assessmentRepository.find({
      where,
      relations: ['assessor'],
      order: { assessment_date: 'DESC', created_at: 'DESC' },
    });

    return assessments.map(assessment => this.toResponseDto(assessment));
  }

  async findLatestByRiskId(riskId: string): Promise<{ inherent?: RiskAssessmentResponseDto; current?: RiskAssessmentResponseDto; target?: RiskAssessmentResponseDto }> {
    const assessments = await this.assessmentRepository.find({
      where: { risk_id: riskId, is_latest: true },
      relations: ['assessor'],
    });

    const result: { inherent?: RiskAssessmentResponseDto; current?: RiskAssessmentResponseDto; target?: RiskAssessmentResponseDto } = {};

    for (const assessment of assessments) {
      result[assessment.assessment_type] = this.toResponseDto(assessment);
    }

    return result;
  }

  async findOne(id: string): Promise<RiskAssessmentResponseDto> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: ['assessor', 'risk'],
    });

    if (!assessment) {
      throw new NotFoundException(`Risk assessment with ID ${id} not found`);
    }

    return this.toResponseDto(assessment);
  }

  async create(createDto: CreateRiskAssessmentDto, userId?: string, organizationId?: string): Promise<RiskAssessmentResponseDto> {
    // Verify risk exists
    const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
    if (!risk) {
      throw new NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
    }

    // Validate assessment method if provided
    if (createDto.assessment_method) {
      const isValidMethod = await this.validateAssessmentMethod(createDto.assessment_method, organizationId);
      if (!isValidMethod) {
        throw new BadRequestException(`Assessment method '${createDto.assessment_method}' is not active or does not exist`);
      }
    }

    // Validate likelihood and impact scales based on assessment method
    await this.validateScaleValues(createDto.likelihood, createDto.impact, createDto.assessment_method, organizationId);

    // Calculate risk score and level using settings
    const riskScore = createDto.likelihood * createDto.impact;
    const riskLevel = await this.calculateRiskLevelFromSettings(riskScore, organizationId);

    // Check if risk exceeds appetite
    const exceedsAppetite = await this.riskSettingsService.exceedsRiskAppetite(riskScore, organizationId);

    const assessment = this.assessmentRepository.create({
      ...createDto,
      assessment_date: createDto.assessment_date ? new Date(createDto.assessment_date) : new Date(),
      risk_score: riskScore,
      risk_level: riskLevel,
      assessor_id: userId,
      created_by: userId,
      is_latest: createDto.is_latest !== false, // Default to true
    });

    const savedAssessment = await this.assessmentRepository.save(assessment);
    
    // Reload with relations
    const fullAssessment = await this.assessmentRepository.findOne({
      where: { id: savedAssessment.id },
      relations: ['assessor'],
    });

    const response = this.toResponseDto(fullAssessment);
    
    // Add appetite warning to response
    if (exceedsAppetite) {
      (response as any).exceeds_risk_appetite = true;
      (response as any).appetite_warning = 'This assessment results in a risk score that exceeds the organization\'s risk appetite threshold';
    }

    return response;
  }

  async getAssessmentHistory(riskId: string, limit = 10): Promise<RiskAssessmentResponseDto[]> {
    const assessments = await this.assessmentRepository.find({
      where: { risk_id: riskId },
      relations: ['assessor'],
      order: { assessment_date: 'DESC', created_at: 'DESC' },
      take: limit,
    });

    return assessments.map(assessment => this.toResponseDto(assessment));
  }

  async compareAssessments(riskId: string): Promise<{
    inherent?: RiskAssessmentResponseDto;
    current?: RiskAssessmentResponseDto;
    target?: RiskAssessmentResponseDto;
    risk_reduction_from_inherent?: number;
    gap_to_target?: number;
  }> {
    const latest = await this.findLatestByRiskId(riskId);
    
    const result: any = { ...latest };

    if (latest.inherent && latest.current) {
      result.risk_reduction_from_inherent = 
        ((latest.inherent.risk_score - latest.current.risk_score) / latest.inherent.risk_score) * 100;
    }

    if (latest.current && latest.target) {
      result.gap_to_target = latest.current.risk_score - latest.target.risk_score;
    }

    return result;
  }

  /**
   * Calculate risk level from organization settings
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
   * Synchronous fallback for comparison methods
   */
  private calculateRiskLevel(score: number): RiskLevel {
    return this.calculateRiskLevelDefault(score);
  }

  /**
   * Validate that the assessment method is active
   */
  private async validateAssessmentMethod(methodId: string, organizationId?: string): Promise<boolean> {
    try {
      const activeMethods = await this.riskSettingsService.getActiveAssessmentMethods(organizationId);
      return activeMethods.some(m => m.id === methodId);
    } catch (error) {
      console.warn('Failed to validate assessment method:', error.message);
      return true; // Allow if settings unavailable
    }
  }

  /**
   * Validate that likelihood and impact values are within the scale defined by the assessment method
   */
  private async validateScaleValues(likelihood: number, impact: number, methodId?: string, organizationId?: string): Promise<void> {
    try {
      const settings = await this.riskSettingsService.getSettings(organizationId);
      
      // Find the assessment method to get scale limits
      let maxLikelihood = 5;
      let maxImpact = 5;
      
      if (methodId) {
        const method = settings.assessment_methods.find(m => m.id === methodId);
        if (method) {
          maxLikelihood = method.likelihoodScale;
          maxImpact = method.impactScale;
        }
      } else {
        // Use default method
        const defaultMethod = settings.assessment_methods.find(m => m.id === settings.default_assessment_method);
        if (defaultMethod) {
          maxLikelihood = defaultMethod.likelihoodScale;
          maxImpact = defaultMethod.impactScale;
        }
      }

      if (likelihood < 1 || likelihood > maxLikelihood) {
        throw new BadRequestException(`Likelihood must be between 1 and ${maxLikelihood}`);
      }

      if (impact < 1 || impact > maxImpact) {
        throw new BadRequestException(`Impact must be between 1 and ${maxImpact}`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Allow if settings unavailable, but validate basic range
      if (likelihood < 1 || likelihood > 5 || impact < 1 || impact > 5) {
        throw new BadRequestException('Likelihood and impact must be between 1 and 5');
      }
    }
  }

  /**
   * Get likelihood scale descriptions from settings
   */
  async getLikelihoodScaleDescriptions(organizationId?: string): Promise<{
    value: number;
    label: string;
    description: string;
  }[]> {
    return this.riskSettingsService.getLikelihoodScale(organizationId);
  }

  /**
   * Get impact scale descriptions from settings
   */
  async getImpactScaleDescriptions(organizationId?: string): Promise<{
    value: number;
    label: string;
    description: string;
  }[]> {
    return this.riskSettingsService.getImpactScale(organizationId);
  }

  private toResponseDto(assessment: RiskAssessment): RiskAssessmentResponseDto {
    return {
      id: assessment.id,
      risk_id: assessment.risk_id,
      assessment_type: assessment.assessment_type,
      likelihood: assessment.likelihood,
      impact: assessment.impact,
      risk_score: assessment.risk_score,
      risk_level: assessment.risk_level,
      financial_impact: assessment.financial_impact,
      financial_impact_amount: assessment.financial_impact_amount,
      operational_impact: assessment.operational_impact,
      reputational_impact: assessment.reputational_impact,
      compliance_impact: assessment.compliance_impact,
      safety_impact: assessment.safety_impact,
      assessment_date: assessment.assessment_date?.toISOString?.() || assessment.assessment_date?.toString(),
      assessor_id: assessment.assessor_id,
      assessor_name: assessment.assessor 
        ? `${assessment.assessor.firstName || ''} ${assessment.assessor.lastName || ''}`.trim() 
        : undefined,
      assessment_method: assessment.assessment_method,
      assessment_notes: assessment.assessment_notes,
      assumptions: assessment.assumptions,
      confidence_level: assessment.confidence_level,
      evidence_attachments: assessment.evidence_attachments,
      is_latest: assessment.is_latest,
      created_at: assessment.created_at?.toISOString(),
      updated_at: assessment.updated_at?.toISOString(),
    };
  }
}

