import { RiskTreatment } from './risk-treatment.entity';
import { User } from '../../users/entities/user.entity';
export declare class TreatmentTask {
    id: string;
    treatment_id: string;
    treatment: RiskTreatment;
    title: string;
    description: string;
    assignee_id: string;
    assignee: User;
    status: string;
    due_date: Date;
    completed_date: Date;
    display_order: number;
    created_at: Date;
    updated_at: Date;
}
