import { IsString, IsOptional, IsUUID, IsEnum, IsInt, Min } from 'class-validator';
import { ObligationStatus, ObligationPriority } from '../entities/compliance-obligation.entity';

export class ObligationQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsEnum(ObligationStatus)
  @IsOptional()
  status?: ObligationStatus;

  @IsEnum(ObligationPriority)
  @IsOptional()
  priority?: ObligationPriority;

  @IsUUID()
  @IsOptional()
  influencer_id?: string;

  @IsUUID()
  @IsOptional()
  owner_id?: string;

  @IsUUID()
  @IsOptional()
  business_unit_id?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string;
}


