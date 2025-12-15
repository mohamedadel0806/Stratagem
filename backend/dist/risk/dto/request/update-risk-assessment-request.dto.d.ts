import { RequestPriority, RequestStatus } from '../../entities/risk-assessment-request.entity';
export declare class UpdateRiskAssessmentRequestDto {
    requested_for_id?: string;
    priority?: RequestPriority;
    status?: RequestStatus;
    due_date?: string;
    justification?: string;
    notes?: string;
    rejection_reason?: string;
}
