import { IsString, IsEnum, IsOptional, IsUUID, IsDateString, IsBoolean, IsObject, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExceptionType } from '../entities/policy-exception.entity';

export class CreatePolicyExceptionDto {
  @ApiProperty({ description: 'Exception identifier (auto-generated if not provided)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  exception_identifier?: string;

  @ApiPropertyOptional({ enum: Object.values(ExceptionType), description: 'Type of exception' })
  @IsOptional()
  @IsEnum(ExceptionType)
  exception_type?: ExceptionType;

  @ApiProperty({ description: 'ID of the entity (policy, standard, control, baseline)' })
  @IsUUID()
  entity_id: string;

  @ApiPropertyOptional({ description: 'Type of entity (policy, standard, control, baseline)' })
  @IsOptional()
  @IsString()
  entity_type?: string;

  @ApiPropertyOptional({ description: 'Requesting business unit ID' })
  @IsOptional()
  @IsUUID()
  requesting_business_unit_id?: string;

  @ApiProperty({ description: 'Business justification for the exception' })
  @IsString()
  business_justification: string;

  @ApiPropertyOptional({ description: 'Compensating controls in place' })
  @IsOptional()
  @IsString()
  compensating_controls?: string;

  @ApiPropertyOptional({ description: 'Risk assessment' })
  @IsOptional()
  @IsString()
  risk_assessment?: string;

  @ApiPropertyOptional({ description: 'Exception start date' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Exception end date' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Auto-expire when end date is reached', default: true })
  @IsOptional()
  @IsBoolean()
  auto_expire?: boolean;

  @ApiPropertyOptional({ description: 'Next review date' })
  @IsOptional()
  @IsDateString()
  next_review_date?: string;

  @ApiPropertyOptional({ description: 'Supporting documents' })
  @IsOptional()
  @IsObject()
  supporting_documents?: Record<string, any>;
}


