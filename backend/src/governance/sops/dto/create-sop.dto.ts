import { IsString, IsOptional, IsUUID, IsEnum, IsArray, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SOPStatus, SOPCategory } from '../entities/sop.entity';

export class CreateSOPDto {
  @ApiProperty({ description: 'Unique identifier for the SOP', example: 'SOP-USER-PROV-001' })
  @IsString()
  @MaxLength(100)
  sop_identifier: string;

  @ApiProperty({ description: 'Title of the SOP', example: 'User Provisioning Procedure' })
  @IsString()
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional({ enum: SOPCategory, description: 'Category of the SOP' })
  @IsEnum(SOPCategory)
  @IsOptional()
  category?: SOPCategory;

  @ApiPropertyOptional({ description: 'Subcategory of the SOP' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  subcategory?: string;

  @ApiPropertyOptional({ description: 'Purpose of the SOP' })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Scope of the SOP' })
  @IsString()
  @IsOptional()
  scope?: string;

  @ApiPropertyOptional({ description: 'Full content of the SOP document' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Version of the SOP', example: '1.0' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  version?: string;

  @ApiPropertyOptional({ enum: SOPStatus, default: SOPStatus.DRAFT })
  @IsEnum(SOPStatus)
  @IsOptional()
  status?: SOPStatus;

  @ApiPropertyOptional({ description: 'ID of the SOP owner' })
  @IsUUID()
  @IsOptional()
  owner_id?: string;

  @ApiPropertyOptional({ description: 'Review frequency', example: 'annual' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  review_frequency?: string;

  @ApiPropertyOptional({ description: 'Next review date', example: '2025-12-31' })
  @IsDateString()
  @IsOptional()
  next_review_date?: string;

  @ApiPropertyOptional({ description: 'Array of policy IDs to link', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  linked_policies?: string[];

  @ApiPropertyOptional({ description: 'Array of standard IDs to link', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  linked_standards?: string[];

  @ApiPropertyOptional({ description: 'Array of control IDs to link', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  control_ids?: string[];

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
