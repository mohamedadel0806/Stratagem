import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsDateString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TestType, TestStatus, SeverityLevel } from '../entities/security-test-result.entity';

export class CreateSecurityTestResultDto {
  @ApiProperty({ enum: ['application', 'software'] })
  @IsEnum(['application', 'software'])
  assetType: 'application' | 'software';

  @ApiProperty()
  @IsUUID()
  assetId: string;

  @ApiProperty({ enum: TestType })
  @IsEnum(TestType)
  testType: TestType;

  @ApiProperty()
  @IsDateString()
  testDate: string;

  @ApiPropertyOptional({ enum: TestStatus, default: TestStatus.COMPLETED })
  @IsOptional()
  @IsEnum(TestStatus)
  status?: TestStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  testerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  testerCompany?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  findingsCritical?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  findingsHigh?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  findingsMedium?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  findingsLow?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  findingsInfo?: number;

  @ApiPropertyOptional({ enum: SeverityLevel })
  @IsOptional()
  @IsEnum(SeverityLevel)
  severity?: SeverityLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  passed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  findings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reportFileId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reportUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  remediationDueDate?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  retestRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  retestDate?: string;
}



