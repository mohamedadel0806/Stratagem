export declare class RiskHeatmapCellDto {
    likelihood: number;
    impact: number;
    count: number;
    riskScore: number;
    riskIds: string[];
}
export declare class RiskHeatmapResponseDto {
    cells: RiskHeatmapCellDto[];
    totalRisks: number;
    maxRiskScore: number;
}
