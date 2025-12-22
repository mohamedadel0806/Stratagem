export declare class CreateSOPStepDto {
    sop_id: string;
    step_number: number;
    title: string;
    description: string;
    expected_outcome?: string;
    responsible_role?: string;
    estimated_duration_minutes?: number;
    notes?: string;
    required_evidence?: string[];
    is_critical?: boolean;
}
export declare class UpdateSOPStepDto {
    step_number?: number;
    title?: string;
    description?: string;
    expected_outcome?: string;
    responsible_role?: string;
    estimated_duration_minutes?: number;
    notes?: string;
    required_evidence?: string[];
    is_critical?: boolean;
}
export declare class SOPStepQueryDto {
    sop_id?: string;
    page?: number;
    limit?: number;
    sort?: string;
}
