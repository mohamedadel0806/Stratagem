import { AssessmentType } from '../../entities/risk-assessment.entity';
import { RequestPriority, RequestStatus } from '../../entities/risk-assessment-request.entity';

export class RiskAssessmentRequestResponseDto {
  id: string;
  request_identifier: string;
  risk_id: string;
  risk_title?: string;
  risk_identifier?: string;
  requested_by_id: string;
  requested_by_name?: string;
  requested_by_email?: string;
  requested_for_id?: string;
  requested_for_name?: string;
  requested_for_email?: string;
  assessment_type: AssessmentType;
  priority: RequestPriority;
  status: RequestStatus;
  due_date?: Date;
  justification?: string;
  notes?: string;
  approval_workflow_id?: string;
  approved_by_id?: string;
  approved_by_name?: string;
  approved_at?: Date;
  rejected_by_id?: string;
  rejected_by_name?: string;
  rejected_at?: Date;
  rejection_reason?: string;
  completed_at?: Date;
  resulting_assessment_id?: string;
  created_at: Date;
  updated_at: Date;
}



