import { StandardStatus } from '../entities/standard.entity';
export declare class CreateStandardDto {
    standard_identifier: string;
    title: string;
    policy_id?: string;
    control_objective_id?: string;
    description?: string;
    content?: string;
    scope?: string;
    applicability?: string;
    compliance_measurement_criteria?: string;
    version?: string;
    status?: StandardStatus;
    owner_id?: string;
    control_objective_ids?: string[];
}
