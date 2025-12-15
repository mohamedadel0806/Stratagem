import { ApiProperty } from '@nestjs/swagger';

export class FrameworkStatusDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  compliancePercentage: number;

  @ApiProperty()
  requirementsMet: number;

  @ApiProperty()
  totalRequirements: number;

  @ApiProperty({ enum: ['improving', 'stable', 'declining'] })
  trend: 'improving' | 'stable' | 'declining';
}

export class ComplianceStatusResponseDto {
  @ApiProperty()
  overallCompliance: number;

  @ApiProperty({ type: [FrameworkStatusDto] })
  frameworks: FrameworkStatusDto[];
}

