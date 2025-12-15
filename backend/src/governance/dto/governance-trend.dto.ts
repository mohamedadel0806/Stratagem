import { ApiProperty } from '@nestjs/swagger';

export class GovernanceTrendPointDto {
  @ApiProperty({ example: '2025-12-01' })
  date: string;

  @ApiProperty({ description: 'Overall compliance percentage for the day' })
  complianceRate: number;

  @ApiProperty({ description: 'Number of controls implemented as of the day' })
  implementedControls: number;

  @ApiProperty({ description: 'Total controls in scope as of the day' })
  totalControls: number;

  @ApiProperty({ description: 'Open findings count as of the day' })
  openFindings: number;

  @ApiProperty({ description: 'Assessment completion percentage for the day' })
  assessmentCompletionRate: number;

  @ApiProperty({ description: 'Risk closure rate percentage for the day' })
  riskClosureRate: number;
}

export class GovernanceForecastPointDto {
  @ApiProperty({ example: '2025-12-15' })
  date: string;

  @ApiProperty({ description: 'Projected compliance percentage' })
  projectedComplianceRate: number;

  @ApiProperty({ description: 'Projected open findings count' })
  projectedOpenFindings: number;
}

export class GovernanceTrendResponseDto {
  @ApiProperty({ type: [GovernanceTrendPointDto] })
  history: GovernanceTrendPointDto[];

  @ApiProperty({ type: [GovernanceForecastPointDto] })
  forecast: GovernanceForecastPointDto[];

  @ApiProperty({ type: GovernanceTrendPointDto })
  latestSnapshot: GovernanceTrendPointDto;

  @ApiProperty({ example: '2025-12-04T08:00:00.000Z' })
  lastUpdatedAt: string;
}
