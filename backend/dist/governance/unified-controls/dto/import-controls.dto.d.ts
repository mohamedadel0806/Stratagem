declare class ImportControlItem {
    control_identifier: string;
    title: string;
    domain?: string;
    control_type?: string;
    complexity?: string;
    cost_impact?: string;
    description?: string;
    control_procedures?: string;
    testing_procedures?: string;
}
export declare class ImportControlsDto {
    controls: ImportControlItem[];
}
export {};
