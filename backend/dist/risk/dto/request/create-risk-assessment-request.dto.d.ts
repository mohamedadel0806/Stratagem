import { AssessmentType } from '../../entities/risk-assessment.entity';
import { RequestPriority } from '../../entities/risk-assessment-request.entity';
export declare class CreateRiskAssessmentRequestDto {
    risk_id: string;
    requested_for_id?: string;
    assessment_type: AssessmentType;
    priority?: RequestPriority;
    due_date?: string;
    justification?: string;
    notes?: string;
}
