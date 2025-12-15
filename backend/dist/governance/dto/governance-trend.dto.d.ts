export declare class GovernanceTrendPointDto {
    date: string;
    complianceRate: number;
    implementedControls: number;
    totalControls: number;
    openFindings: number;
    assessmentCompletionRate: number;
    riskClosureRate: number;
}
export declare class GovernanceForecastPointDto {
    date: string;
    projectedComplianceRate: number;
    projectedOpenFindings: number;
}
export declare class GovernanceTrendResponseDto {
    history: GovernanceTrendPointDto[];
    forecast: GovernanceForecastPointDto[];
    latestSnapshot: GovernanceTrendPointDto;
    lastUpdatedAt: string;
}
