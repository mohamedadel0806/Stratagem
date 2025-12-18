import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';

export enum ReportType {
  POLICY_COMPLIANCE = 'policy_compliance',
  INFLUENCER = 'influencer',
  CONTROL_IMPLEMENTATION = 'control_implementation',
  ASSESSMENT = 'assessment',
  FINDINGS = 'findings',
  CONTROL_STATUS = 'control_status',
}

export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'xlsx',
  PDF = 'pdf',
}

export class ReportQueryDto {
  @ApiProperty({ enum: ReportType, description: 'Type of report to generate' })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ enum: ExportFormat, description: 'Export format', default: ExportFormat.CSV })
  @IsEnum(ExportFormat)
  @IsOptional()
  format?: ExportFormat = ExportFormat.CSV;

  @ApiProperty({ required: false, description: 'Start date for date range filter' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false, description: 'End date for date range filter' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false, description: 'Status filter' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false, description: 'Additional filters as JSON string' })
  @IsString()
  @IsOptional()
  filters?: string;
}





