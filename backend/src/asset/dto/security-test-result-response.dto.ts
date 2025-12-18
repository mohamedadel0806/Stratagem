import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestType, TestStatus, SeverityLevel } from '../entities/security-test-result.entity';

export class SecurityTestResultResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['application', 'software'] })
  assetType: 'application' | 'software';

  @ApiProperty()
  assetId: string;

  @ApiProperty({ enum: TestType })
  testType: TestType;

  @ApiProperty()
  testDate: Date;

  @ApiProperty({ enum: TestStatus })
  status: TestStatus;

  @ApiPropertyOptional()
  testerName?: string;

  @ApiPropertyOptional()
  testerCompany?: string;

  @ApiProperty()
  findingsCritical: number;

  @ApiProperty()
  findingsHigh: number;

  @ApiProperty()
  findingsMedium: number;

  @ApiProperty()
  findingsLow: number;

  @ApiProperty()
  findingsInfo: number;

  @ApiPropertyOptional({ enum: SeverityLevel })
  severity?: SeverityLevel;

  @ApiPropertyOptional()
  overallScore?: number;

  @ApiProperty()
  passed: boolean;

  @ApiPropertyOptional()
  summary?: string;

  @ApiPropertyOptional()
  findings?: string;

  @ApiPropertyOptional()
  recommendations?: string;

  @ApiPropertyOptional()
  reportFileId?: string;

  @ApiPropertyOptional()
  reportUrl?: string;

  @ApiPropertyOptional()
  remediationDueDate?: Date;

  @ApiProperty()
  remediationCompleted: boolean;

  @ApiProperty()
  retestRequired: boolean;

  @ApiPropertyOptional()
  retestDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

