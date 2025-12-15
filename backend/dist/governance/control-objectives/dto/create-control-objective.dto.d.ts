import { ImplementationStatus } from '../entities/control-objective.entity';
export declare class CreateControlObjectiveDto {
    objective_identifier: string;
    policy_id: string;
    statement: string;
    rationale?: string;
    domain?: string;
    priority?: string;
    mandatory?: boolean;
    responsible_party_id?: string;
    implementation_status?: ImplementationStatus;
    target_implementation_date?: string;
    actual_implementation_date?: string;
    linked_influencers?: string[];
    display_order?: number;
}
