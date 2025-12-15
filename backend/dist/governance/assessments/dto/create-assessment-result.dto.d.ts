import { AssessmentResultEnum } from '../entities/assessment-result.entity';
export declare class CreateAssessmentResultDto {
    assessment_id: string;
    unified_control_id: string;
    assessor_id?: string;
    assessment_date?: string;
    assessment_procedure_followed?: string;
    result: AssessmentResultEnum;
    effectiveness_rating?: number;
    findings?: string;
    observations?: string;
    recommendations?: string;
    evidence_collected?: Array<{
        filename: string;
        path: string;
        description: string;
    }>;
    requires_remediation?: boolean;
    remediation_due_date?: string;
}
