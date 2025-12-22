import { IsOptional, IsEnum, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ControlType, ControlStatus, ImplementationStatus } from '../entities/unified-control.entity';

export class UnifiedControlQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number = 25;

  @IsOptional()
  @IsEnum(ControlType)
  control_type?: ControlType;

  @IsOptional()
  @IsEnum(ControlStatus)
  status?: ControlStatus;

  @IsOptional()
  @IsEnum(ImplementationStatus)
  implementation_status?: ImplementationStatus;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsUUID()
  control_owner_id?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}







