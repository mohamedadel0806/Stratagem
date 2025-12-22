import { User } from '../../../users/entities/user.entity';
import { ControlObjective } from '../../control-objectives/entities/control-objective.entity';
export declare enum BaselineStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DEPRECATED = "deprecated",
    ARCHIVED = "archived"
}
export declare class SecureBaseline {
    id: string;
    baseline_identifier: string;
    name: string;
    description: string;
    category: string;
    version: string;
    status: BaselineStatus;
    owner_id: string | null;
    owner: User | null;
    requirements: BaselineRequirement[];
    control_objectives: ControlObjective[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
export declare class BaselineRequirement {
    id: string;
    baseline_id: string;
    baseline: SecureBaseline;
    requirement_identifier: string;
    title: string;
    description: string;
    configuration_value: string;
    validation_method: string;
    display_order: number;
    created_at: Date;
    updated_at: Date;
}
