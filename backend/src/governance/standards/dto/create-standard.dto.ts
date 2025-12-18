import { IsString, IsOptional, IsUUID, IsEnum, MaxLength, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StandardStatus } from '../entities/standard.entity';

export class CreateStandardDto {
  @ApiProperty({ description: 'Unique identifier for the standard', example: 'STD-INFOSEC-001' })
  @IsString()
  @MaxLength(100)
  standard_identifier: string;

  @ApiProperty({ description: 'Title of the standard', example: 'Information Security Standard' })
  @IsString()
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional({ description: 'ID of the parent policy' })
  @IsUUID()
  @IsOptional()
  policy_id?: string;

  @ApiPropertyOptional({ description: 'ID of the primary control objective' })
  @IsUUID()
  @IsOptional()
  control_objective_id?: string;

  @ApiPropertyOptional({ description: 'Description of the standard' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Full content of the standard document' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Scope of the standard' })
  @IsString()
  @IsOptional()
  scope?: string;

  @ApiPropertyOptional({ description: 'Applicability statement' })
  @IsString()
  @IsOptional()
  applicability?: string;

  @ApiPropertyOptional({ description: 'Compliance measurement criteria' })
  @IsString()
  @IsOptional()
  compliance_measurement_criteria?: string;

  @ApiPropertyOptional({ description: 'Version of the standard', example: '1.0' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  version?: string;

  @ApiPropertyOptional({ enum: StandardStatus, default: StandardStatus.DRAFT })
  @IsEnum(StandardStatus)
  @IsOptional()
  status?: StandardStatus;

  @ApiPropertyOptional({ description: 'ID of the standard owner' })
  @IsUUID()
  @IsOptional()
  owner_id?: string;

  @ApiPropertyOptional({ description: 'Array of control objective IDs to link', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  control_objective_ids?: string[];
}
