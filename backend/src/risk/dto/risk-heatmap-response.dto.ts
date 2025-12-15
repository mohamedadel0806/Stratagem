import { ApiProperty } from '@nestjs/swagger';

export class RiskHeatmapCellDto {
  @ApiProperty()
  likelihood: number;

  @ApiProperty()
  impact: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  riskScore: number;

  @ApiProperty({ type: [String] })
  riskIds: string[];
}

export class RiskHeatmapResponseDto {
  @ApiProperty({ type: [RiskHeatmapCellDto] })
  cells: RiskHeatmapCellDto[];

  @ApiProperty()
  totalRisks: number;

  @ApiProperty()
  maxRiskScore: number;
}

