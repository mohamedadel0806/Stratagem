import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { BaselineStatus } from '../entities/baseline.entity';

export class BaselineQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsEnum(BaselineStatus)
  @IsOptional()
  status?: BaselineStatus;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string;
}


