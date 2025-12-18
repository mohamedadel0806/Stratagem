import { User } from '../../../users/entities/user.entity';
import { Policy } from '../../policies/entities/policy.entity';
import { ControlObjective } from '../../control-objectives/entities/control-objective.entity';
export declare enum StandardStatus {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class Standard {
    id: string;
    standard_identifier: string;
    title: string;
    policy_id: string;
    policy: Policy;
    control_objective_id: string;
    control_objective: ControlObjective;
    description: string;
    content: string;
    scope: string;
    applicability: string;
    compliance_measurement_criteria: string;
    version: string;
    status: StandardStatus;
    owner_id: string;
    owner: User;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
    control_objectives: ControlObjective[];
}
