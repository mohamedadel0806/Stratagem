import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComplianceStatus } from '../entities/asset-requirement-mapping.entity';
import { AssessmentType } from '../entities/compliance-assessment.entity';

export interface ValidationResults {
  ruleId: string;
  ruleName: string;
  applicable: boolean;
  status: ComplianceStatus;
  message: string;
  details?: Record<string, any>;
}

export class RuleEvaluationResultDto {
  @ApiProperty()
  ruleId: string;

  @ApiProperty()
  ruleName: string;

  @ApiProperty()
  applicable: boolean;

  @ApiProperty({ enum: ComplianceStatus })
  status: ComplianceStatus;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  details?: Record<string, any>;
}

export class AssessmentResultDto {
  @ApiProperty()
  assetType: string;

  @ApiProperty()
  assetId: string;

  @ApiProperty()
  requirementId: string;

  @ApiProperty()
  requirementTitle: string;

  @ApiProperty({ enum: ComplianceStatus })
  status: ComplianceStatus;

  @ApiProperty({ type: [RuleEvaluationResultDto] })
  ruleResults: RuleEvaluationResultDto[];

  @ApiPropertyOptional()
  recommendations?: string[];

  @ApiProperty()
  assessedAt: string;

  @ApiProperty({ enum: AssessmentType })
  assessmentType: AssessmentType;
}

export class AssetComplianceStatusDto {
  @ApiProperty()
  assetType: string;

  @ApiProperty()
  assetId: string;

  @ApiProperty()
  totalRequirements: number;

  @ApiProperty()
  compliantCount: number;

  @ApiProperty()
  nonCompliantCount: number;

  @ApiProperty()
  partiallyCompliantCount: number;

  @ApiProperty()
  notAssessedCount: number;

  @ApiProperty()
  requiresReviewCount: number;

  @ApiProperty()
  notApplicableCount: number;

  @ApiProperty()
  overallCompliancePercentage: number;

  @ApiProperty({ type: [AssessmentResultDto] })
  requirements: AssessmentResultDto[];
}

export class ComplianceGapDto {
  @ApiProperty()
  requirementId: string;

  @ApiProperty()
  requirementTitle: string;

  @ApiProperty()
  requirementCode: string;

  @ApiProperty({ enum: ComplianceStatus })
  currentStatus: ComplianceStatus;

  @ApiProperty()
  gapDescription: string;

  @ApiProperty({ type: [String] })
  recommendations: string[];

  @ApiProperty({ type: [String] })
  missingFields: string[];

  @ApiProperty({ type: [RuleEvaluationResultDto] })
  failedRules: RuleEvaluationResultDto[];
}

export class BulkAssessmentResultDto {
  @ApiProperty()
  totalAssessed: number;

  @ApiProperty()
  successful: number;

  @ApiProperty()
  failed: number;

  @ApiProperty({ type: [String] })
  errors: string[];

  @ApiProperty({ type: [AssessmentResultDto] })
  results: AssessmentResultDto[];
}

export class LinkedControlDto {
  @ApiProperty()
  controlId: string;

  @ApiProperty()
  controlName: string;

  @ApiProperty()
  controlDescription?: string;

  @ApiProperty({ enum: ['not_implemented', 'planned', 'in_progress', 'implemented', 'not_applicable'] })
  implementationStatus: string;

  @ApiProperty()
  implementationDate?: string;

  @ApiProperty()
  lastTestDate?: string;

  @ApiProperty()
  lastTestResult?: string;

  @ApiPropertyOptional()
  effectivenessScore?: number;

  @ApiProperty()
  isAutomated: boolean;

  @ApiPropertyOptional()
  implementationNotes?: string;
}

export class AssetComplianceSummaryDto {
  @ApiProperty()
  assetId: string;

  @ApiProperty()
  assetType: string;

  @ApiProperty()
  assetName: string;

  @ApiProperty()
  assetIdentifier?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  criticality?: string;

  @ApiPropertyOptional()
  businessUnit?: string;

  @ApiProperty()
  totalRequirements: number;

  @ApiProperty()
  compliantCount: number;

  @ApiProperty()
  nonCompliantCount: number;

  @ApiProperty()
  partiallyCompliantCount: number;

  @ApiProperty()
  notAssessedCount: number;

  @ApiProperty()
  overallCompliancePercentage: number;

  @ApiProperty()
  controlsLinkedCount: number;

  @ApiProperty({ type: [LinkedControlDto] })
  linkedControls: LinkedControlDto[];

  @ApiProperty()
  lastAssessmentDate?: string;

  @ApiProperty({ enum: ComplianceStatus })
  overallComplianceStatus: ComplianceStatus;
}

export class AssetComplianceListResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty({ type: [AssetComplianceSummaryDto] })
  assets: AssetComplianceSummaryDto[];

  @ApiProperty()
  complianceSummary: {
    totalAssets: number;
    compliantAssets: number;
    nonCompliantAssets: number;
    partiallyCompliantAssets: number;
    averageCompliancePercentage: number;
  };
}








