import { User } from '../../../users/entities/user.entity';
import { Assessment } from './assessment.entity';
import { UnifiedControl } from '../../unified-controls/entities/unified-control.entity';
export declare enum AssessmentResultEnum {
    COMPLIANT = "compliant",
    NON_COMPLIANT = "non_compliant",
    PARTIALLY_COMPLIANT = "partially_compliant",
    NOT_APPLICABLE = "not_applicable",
    NOT_TESTED = "not_tested"
}
export declare class AssessmentResult {
    id: string;
    assessment_id: string;
    assessment: Assessment;
    unified_control_id: string;
    unified_control: UnifiedControl;
    assessor_id: string;
    assessor: User;
    assessment_date: Date;
    assessment_procedure_followed: string;
    result: AssessmentResultEnum;
    effectiveness_rating: number;
    findings: string;
    observations: string;
    recommendations: string;
    evidence_collected: Array<{
        filename: string;
        path: string;
        description: string;
    }>;
    requires_remediation: boolean;
    remediation_due_date: Date;
    created_at: Date;
    updated_at: Date;
}
