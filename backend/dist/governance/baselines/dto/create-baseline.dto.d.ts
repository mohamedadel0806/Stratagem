import { BaselineStatus } from '../entities/baseline.entity';
export declare class CreateBaselineRequirementDto {
    requirement_identifier: string;
    title: string;
    description?: string;
    configuration_value?: string;
    validation_method?: string;
    display_order?: number;
}
export declare class CreateSecureBaselineDto {
    baseline_identifier?: string;
    name: string;
    description?: string;
    category?: string;
    version?: string;
    status?: BaselineStatus;
    owner_id?: string;
    requirements?: CreateBaselineRequirementDto[];
    control_objective_ids?: string[];
}
