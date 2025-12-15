import { RiskAssessmentService } from '../services/risk-assessment.service';
import { CreateRiskAssessmentDto } from '../dto/assessment/create-risk-assessment.dto';
import { AssessmentType } from '../entities/risk-assessment.entity';
export declare class RiskAssessmentController {
    private readonly assessmentService;
    constructor(assessmentService: RiskAssessmentService);
    getLikelihoodScale(req: any): Promise<{
        value: number;
        label: string;
        description: string;
    }[]>;
    getImpactScale(req: any): Promise<{
        value: number;
        label: string;
        description: string;
    }[]>;
    findByRiskId(riskId: string, assessmentType?: AssessmentType): Promise<import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto[]>;
    findLatestByRiskId(riskId: string): Promise<{
        inherent?: import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto;
        current?: import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto;
        target?: import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto;
    }>;
    compareAssessments(riskId: string): Promise<{
        inherent?: import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto;
        current?: import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto;
        target?: import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto;
        risk_reduction_from_inherent?: number;
        gap_to_target?: number;
    }>;
    getHistory(riskId: string, limit?: number): Promise<import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto[]>;
    findOne(id: string): Promise<import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto>;
    create(createDto: CreateRiskAssessmentDto, req: any): Promise<import("../dto/assessment/risk-assessment-response.dto").RiskAssessmentResponseDto>;
}
