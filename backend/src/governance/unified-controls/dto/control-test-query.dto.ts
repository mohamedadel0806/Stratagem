import { IsOptional, IsEnum, IsUUID, IsInt, Min, IsString } from 'class-validator';
import { ControlTestType, ControlTestStatus, ControlTestResult } from '../entities/control-test.entity';

export class ControlTestQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsUUID()
  @IsOptional()
  unified_control_id?: string;

  @IsUUID()
  @IsOptional()
  tester_id?: string;

  @IsEnum(ControlTestType)
  @IsOptional()
  test_type?: ControlTestType;

  @IsEnum(ControlTestStatus)
  @IsOptional()
  status?: ControlTestStatus;

  @IsEnum(ControlTestResult)
  @IsOptional()
  result?: ControlTestResult;

  @IsString()
  @IsOptional()
  search?: string;
}


