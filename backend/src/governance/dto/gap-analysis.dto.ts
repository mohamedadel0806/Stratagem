import { ApiProperty } from '@nestjs/swagger';

export enum GapType {
  FRAMEWORK = 'framework',
  CONTROL = 'control',
  ASSET = 'asset',
  EVIDENCE = 'evidence',
  ASSESSMENT = 'assessment',
}

export class RequirementGapDto {
  @ApiProperty()
  requirementId: string;

  @ApiProperty()
  requirementIdentifier: string;

  @ApiProperty()
  requirementText: string;

  @ApiProperty()
  frameworkId: string;

  @ApiProperty()
  frameworkName?: string;

  @ApiProperty()
  domain?: string;

  @ApiProperty()
  category?: string;

  @ApiProperty()
  priority?: string;

  @ApiProperty()
  coverageLevel?: 'full' | 'partial' | 'none';

  @ApiProperty()
  mappedControlsCount: number;

  @ApiProperty()
  gapSeverity: 'critical' | 'high' | 'medium' | 'low';
}

export class FrameworkGapSummaryDto {
  @ApiProperty()
  frameworkId: string;

  @ApiProperty()
  frameworkName: string;

  @ApiProperty()
  totalRequirements: number;

  @ApiProperty()
  mappedRequirements: number;

  @ApiProperty()
  unmappedRequirements: number;

  @ApiProperty()
  partialCoverageRequirements: number;

  @ApiProperty()
  coveragePercentage: number;

  @ApiProperty({ type: [RequirementGapDto] })
  gaps: RequirementGapDto[];

  @ApiProperty()
  criticalGapsCount: number;

  @ApiProperty()
  highPriorityGapsCount: number;
}

export class GapAnalysisDto {
  @ApiProperty()
  generatedAt: Date;

  @ApiProperty()
  totalFrameworks: number;

  @ApiProperty()
  totalRequirements: number;

  @ApiProperty()
  totalMappedRequirements: number;

  @ApiProperty()
  totalUnmappedRequirements: number;

  @ApiProperty()
  overallCoveragePercentage: number;

  @ApiProperty({ type: [FrameworkGapSummaryDto] })
  frameworks: FrameworkGapSummaryDto[];

  @ApiProperty({ type: [RequirementGapDto] })
  allGaps: RequirementGapDto[];

  @ApiProperty()
  criticalGapsCount: number;

  @ApiProperty()
  recommendations: string[];
}

export class GapAnalysisQueryDto {
  @ApiProperty({ required: false, description: 'Comma-separated framework IDs' })
  frameworkIds?: string;

  @ApiProperty({ required: false, enum: GapType })
  gapType?: GapType;

  @ApiProperty({ required: false, description: 'Filter by domain' })
  domain?: string;

  @ApiProperty({ required: false, description: 'Filter by category' })
  category?: string;

  @ApiProperty({ required: false, description: 'Include only critical/high priority gaps' })
  priorityOnly?: boolean;
}







