import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { ObligationStatus, ObligationPriority } from '../entities/compliance-obligation.entity';

export class CreateComplianceObligationDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  obligation_identifier?: string;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  influencer_id?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  source_reference?: string;

  @IsUUID()
  @IsOptional()
  owner_id?: string;

  @IsUUID()
  @IsOptional()
  business_unit_id?: string;

  @IsEnum(ObligationStatus)
  @IsOptional()
  status?: ObligationStatus;

  @IsEnum(ObligationPriority)
  @IsOptional()
  priority?: ObligationPriority;

  @IsDateString()
  @IsOptional()
  due_date?: string;

  @IsString()
  @IsOptional()
  evidence_summary?: string;
}


