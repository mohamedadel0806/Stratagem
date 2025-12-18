import { Repository } from 'typeorm';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { Assessment } from '../assessments/entities/assessment.entity';
import { AssessmentResult } from '../assessments/entities/assessment-result.entity';
import { FrameworkControlMapping } from '../unified-controls/entities/framework-control-mapping.entity';
import { FrameworkRequirement } from '../unified-controls/entities/framework-requirement.entity';
import { ComplianceFramework } from '../../common/entities/compliance-framework.entity';
export declare enum ComplianceStatus {
    MET = "met",
    NOT_MET = "not_met",
    PARTIALLY_MET = "partially_met",
    NOT_APPLICABLE = "not_applicable"
}
export interface FrameworkScorecardDto {
    frameworkId: string;
    frameworkName: string;
    frameworkCode: string;
    overallCompliance: number;
    totalRequirements: number;
    metRequirements: number;
    notMetRequirements: number;
    partiallyMetRequirements: number;
    notApplicableRequirements: number;
    breakdownByDomain: DomainBreakdown[];
    controlImplementationStatus: {
        implemented: number;
        inProgress: number;
        planned: number;
        notImplemented: number;
    };
    assessmentResults: {
        completed: number;
        inProgress: number;
        averageScore: number;
    };
    gaps: {
        total: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    trend?: {
        previousPeriod: number;
        change: number;
        trend: 'improving' | 'declining' | 'stable';
    };
}
export interface DomainBreakdown {
    domain: string;
    totalRequirements: number;
    met: number;
    notMet: number;
    partiallyMet: number;
    notApplicable: number;
    compliancePercentage: number;
}
export interface ComplianceScorecardResponse {
    generatedAt: Date;
    frameworks: FrameworkScorecardDto[];
    overallCompliance: number;
    summary: {
        totalFrameworks: number;
        totalRequirements: number;
        totalMet: number;
        totalNotMet: number;
        averageCompliance: number;
    };
}
export declare class ComplianceScorecardService {
    private controlRepository;
    private assessmentRepository;
    private assessmentResultRepository;
    private mappingRepository;
    private requirementRepository;
    private frameworkRepository;
    constructor(controlRepository: Repository<UnifiedControl>, assessmentRepository: Repository<Assessment>, assessmentResultRepository: Repository<AssessmentResult>, mappingRepository: Repository<FrameworkControlMapping>, requirementRepository: Repository<FrameworkRequirement>, frameworkRepository: Repository<ComplianceFramework>);
    generateScorecard(frameworkIds?: string[]): Promise<ComplianceScorecardResponse>;
    private calculateFrameworkScorecard;
    private calculateTrend;
}
