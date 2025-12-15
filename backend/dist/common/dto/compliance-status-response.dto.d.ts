export declare class FrameworkStatusDto {
    name: string;
    compliancePercentage: number;
    requirementsMet: number;
    totalRequirements: number;
    trend: 'improving' | 'stable' | 'declining';
}
export declare class ComplianceStatusResponseDto {
    overallCompliance: number;
    frameworks: FrameworkStatusDto[];
}
