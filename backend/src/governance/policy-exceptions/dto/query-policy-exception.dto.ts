import { IsOptional, IsEnum, IsUUID, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ExceptionStatus, ExceptionType } from '../entities/policy-exception.entity';

export class QueryPolicyExceptionDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: Object.values(ExceptionStatus) })
  @IsOptional()
  @IsEnum(ExceptionStatus)
  status?: ExceptionStatus;

  @ApiPropertyOptional({ enum: Object.values(ExceptionType) })
  @IsOptional()
  @IsEnum(ExceptionType)
  exception_type?: ExceptionType;

  @ApiPropertyOptional({ description: 'Entity ID filter' })
  @IsOptional()
  @IsUUID()
  entity_id?: string;

  @ApiPropertyOptional({ description: 'Entity type filter' })
  @IsOptional()
  @IsString()
  entity_type?: string;

  @ApiPropertyOptional({ description: 'Requested by user ID' })
  @IsOptional()
  @IsUUID()
  requested_by?: string;

  @ApiPropertyOptional({ description: 'Business unit ID' })
  @IsOptional()
  @IsUUID()
  requesting_business_unit_id?: string;

  @ApiPropertyOptional({ description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;
}
