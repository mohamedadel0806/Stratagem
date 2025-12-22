import { IsString, IsEnum, IsOptional, IsArray, IsBoolean, IsObject } from 'class-validator';
import { ReportType, ReportFormat, ScheduleFrequency } from '../entities/report-template.entity';

export class CreateReportTemplateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ReportType)
  reportType: ReportType;

  @IsEnum(ReportFormat)
  @IsOptional()
  format?: ReportFormat;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fieldSelection?: string[];

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;

  @IsObject()
  @IsOptional()
  grouping?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isScheduled?: boolean;

  @IsEnum(ScheduleFrequency)
  @IsOptional()
  scheduleFrequency?: ScheduleFrequency;

  @IsString()
  @IsOptional()
  scheduleCron?: string;

  @IsString()
  @IsOptional()
  scheduleTime?: string;

  @IsString()
  @IsOptional()
  distributionListId?: string;

  @IsBoolean()
  @IsOptional()
  isShared?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sharedWithUserIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sharedWithTeamIds?: string[];

  @IsBoolean()
  @IsOptional()
  isOrganizationWide?: boolean;
}



