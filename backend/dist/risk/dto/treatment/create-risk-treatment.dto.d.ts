import { TreatmentStrategy, TreatmentStatus, TreatmentPriority } from '../../entities/risk-treatment.entity';
export declare class CreateRiskTreatmentDto {
    risk_id: string;
    strategy: TreatmentStrategy;
    title: string;
    description?: string;
    treatment_owner_id?: string;
    status?: TreatmentStatus;
    priority?: TreatmentPriority;
    start_date?: string;
    target_completion_date?: string;
    estimated_cost?: number;
    expected_risk_reduction?: string;
    residual_likelihood?: number;
    residual_impact?: number;
    implementation_notes?: string;
    linked_control_ids?: string[];
}
