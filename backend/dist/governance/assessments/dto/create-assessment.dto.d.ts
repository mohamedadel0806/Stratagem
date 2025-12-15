import { AssessmentType, AssessmentStatus } from '../entities/assessment.entity';
export declare class CreateAssessmentDto {
    assessment_identifier: string;
    name: string;
    description?: string;
    assessment_type: AssessmentType;
    scope_description?: string;
    selected_control_ids?: string[];
    selected_framework_ids?: string[];
    start_date?: string;
    end_date?: string;
    status?: AssessmentStatus;
    lead_assessor_id?: string;
    assessor_ids?: string[];
    controls_total?: number;
    assessment_procedures?: string;
    tags?: string[];
}
