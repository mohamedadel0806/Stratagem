import { TreatmentStrategy, TreatmentStatus, TreatmentPriority } from '../../entities/risk-treatment.entity';

export class TreatmentTaskResponseDto {
  id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  assignee_name?: string;
  status: string;
  due_date?: string;
  completed_date?: string;
  display_order: number;
}

export class RiskTreatmentResponseDto {
  id: string;
  treatment_id: string;
  risk_id: string;
  risk_title?: string;
  strategy: TreatmentStrategy;
  title: string;
  description?: string;
  treatment_owner_id?: string;
  treatment_owner_name?: string;
  status: TreatmentStatus;
  priority: TreatmentPriority;
  start_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  expected_risk_reduction?: string;
  residual_likelihood?: number;
  residual_impact?: number;
  residual_risk_score?: number;
  progress_percentage: number;
  progress_notes?: string;
  implementation_notes?: string;
  linked_control_ids?: string[];
  tasks?: TreatmentTaskResponseDto[];
  total_tasks?: number;
  completed_tasks?: number;
  due_status?: 'on_track' | 'due_soon' | 'overdue' | 'completed';
  created_at: string;
  updated_at: string;
}







