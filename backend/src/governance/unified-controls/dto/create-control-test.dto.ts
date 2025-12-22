import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsInt, Min, Max, IsArray } from 'class-validator';
import { ControlTestType, ControlTestStatus, ControlTestResult } from '../entities/control-test.entity';

export class CreateControlTestDto {
  @IsUUID()
  unified_control_id: string;

  @IsUUID()
  @IsOptional()
  control_asset_mapping_id?: string;

  @IsEnum(ControlTestType)
  @IsOptional()
  test_type?: ControlTestType;

  @IsDateString()
  test_date: string;

  @IsEnum(ControlTestStatus)
  @IsOptional()
  status?: ControlTestStatus;

  @IsEnum(ControlTestResult)
  @IsOptional()
  result?: ControlTestResult;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  effectiveness_score?: number;

  @IsString()
  @IsOptional()
  test_procedure?: string;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsString()
  @IsOptional()
  recommendations?: string;

  @IsArray()
  @IsOptional()
  evidence_links?: Array<{ title: string; url: string; uploaded_at: string }>;

  @IsUUID()
  @IsOptional()
  tester_id?: string;
}


