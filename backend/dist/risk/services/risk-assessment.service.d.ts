import { Repository } from 'typeorm';
import { RiskAssessment, AssessmentType } from '../entities/risk-assessment.entity';
import { Risk } from '../entities/risk.entity';
import { CreateRiskAssessmentDto } from '../dto/assessment/create-risk-assessment.dto';
import { RiskAssessmentResponseDto } from '../dto/assessment/risk-assessment-response.dto';
import { RiskSettingsService } from './risk-settings.service';
export declare class RiskAssessmentService {
    private assessmentRepository;
    private riskRepository;
    private riskSettingsService;
    constructor(assessmentRepository: Repository<RiskAssessment>, riskRepository: Repository<Risk>, riskSettingsService: RiskSettingsService);
    findByRiskId(riskId: string, assessmentType?: AssessmentType): Promise<RiskAssessmentResponseDto[]>;
    findLatestByRiskId(riskId: string): Promise<{
        inherent?: RiskAssessmentResponseDto;
        current?: RiskAssessmentResponseDto;
        target?: RiskAssessmentResponseDto;
    }>;
    findOne(id: string): Promise<RiskAssessmentResponseDto>;
    create(createDto: CreateRiskAssessmentDto, userId?: string, organizationId?: string): Promise<RiskAssessmentResponseDto>;
    getAssessmentHistory(riskId: string, limit?: number): Promise<RiskAssessmentResponseDto[]>;
    compareAssessments(riskId: string): Promise<{
        inherent?: RiskAssessmentResponseDto;
        current?: RiskAssessmentResponseDto;
        target?: RiskAssessmentResponseDto;
        risk_reduction_from_inherent?: number;
        gap_to_target?: number;
    }>;
    private calculateRiskLevelFromSettings;
    private calculateRiskLevelDefault;
    private calculateRiskLevel;
    private validateAssessmentMethod;
    private validateScaleValues;
    getLikelihoodScaleDescriptions(organizationId?: string): Promise<{
        value: number;
        label: string;
        description: string;
    }[]>;
    getImpactScaleDescriptions(organizationId?: string): Promise<{
        value: number;
        label: string;
        description: string;
    }[]>;
    private toResponseDto;
}
