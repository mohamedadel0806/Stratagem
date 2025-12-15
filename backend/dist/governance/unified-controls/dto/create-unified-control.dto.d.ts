import { ControlType, ControlComplexity, ControlCostImpact, ControlStatus, ImplementationStatus } from '../entities/unified-control.entity';
export declare class CreateUnifiedControlDto {
    control_identifier: string;
    title: string;
    description?: string;
    control_type?: ControlType;
    control_category?: string;
    domain?: string;
    complexity?: ControlComplexity;
    cost_impact?: ControlCostImpact;
    status?: ControlStatus;
    implementation_status?: ImplementationStatus;
    control_owner_id?: string;
    control_procedures?: string;
    testing_procedures?: string;
    tags?: string[];
    custom_fields?: Record<string, any>;
}
