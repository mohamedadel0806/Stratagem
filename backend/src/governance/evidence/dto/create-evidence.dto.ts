import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
  IsUUID,
  IsBoolean,
  IsObject,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { EvidenceType, EvidenceStatus } from '../entities/evidence.entity';

export class CreateEvidenceDto {
  @IsString()
  @MaxLength(100)
  evidence_identifier: string;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EvidenceType)
  evidence_type: EvidenceType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  filename?: string;

  @IsString()
  file_path: string;

  @IsOptional()
  @IsNumber()
  file_size?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  mime_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  file_hash?: string;

  @IsOptional()
  @IsDateString()
  collection_date?: string;

  @IsOptional()
  @IsDateString()
  valid_from_date?: string;

  @IsOptional()
  @IsDateString()
  valid_until_date?: string;

  @IsOptional()
  @IsUUID()
  collector_id?: string;

  @IsOptional()
  @IsEnum(EvidenceStatus)
  status?: EvidenceStatus;

  @IsOptional()
  @IsDateString()
  approval_date?: string;

  @IsOptional()
  @IsString()
  rejection_reason?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  custom_metadata?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  confidential?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  restricted_to_roles?: string[];
}







