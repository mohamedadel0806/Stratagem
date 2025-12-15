import { User } from '../../../users/entities/user.entity';
import { Policy } from '../../policies/entities/policy.entity';
export declare enum ImplementationStatus {
    NOT_IMPLEMENTED = "not_implemented",
    PLANNED = "planned",
    IN_PROGRESS = "in_progress",
    IMPLEMENTED = "implemented",
    NOT_APPLICABLE = "not_applicable"
}
export declare class ControlObjective {
    id: string;
    objective_identifier: string;
    policy_id: string;
    policy: Policy;
    statement: string;
    rationale: string;
    domain: string;
    priority: string;
    mandatory: boolean;
    responsible_party_id: string;
    responsible_party: User;
    implementation_status: ImplementationStatus;
    target_implementation_date: Date;
    actual_implementation_date: Date;
    linked_influencers: string[];
    display_order: number;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
