import { IsString, IsOptional, IsUUID, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateKRIMeasurementDto {
  @IsUUID()
  kri_id: string;

  @IsDateString()
  measurement_date: string;

  @IsNumber()
  value: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  evidence_attachments?: Record<string, any>[];
}




