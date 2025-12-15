import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString, IsArray, IsUUID, IsNumber, IsObject, ValidateNested, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';
import { CriticalityLevel } from '../entities/physical-asset.entity';

export class ContactDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;
}

export class CreateSupplierDto {
  @ApiPropertyOptional({ description: 'Unique identifier (auto-generated if not provided)', maxLength: 100 })
  @IsOptional()
  @IsString()
  uniqueIdentifier?: string;

  @ApiProperty({ description: 'Supplier name (VARCHAR 300, REQUIRED)', maxLength: 300 })
  @IsString()
  supplierName: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  supplierType?: string;

  @ApiPropertyOptional({ description: 'Business purpose' })
  @IsOptional()
  @IsString()
  businessPurpose?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional({ description: 'Business unit ID (FK to business_units)' })
  @IsOptional()
  @IsUUID()
  businessUnitId?: string;

  @ApiPropertyOptional({ type: [String], description: 'Goods/services type (JSONB)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goodsServicesType?: string[];

  @ApiPropertyOptional({ enum: CriticalityLevel })
  @IsOptional()
  @IsEnum(CriticalityLevel)
  criticalityLevel?: CriticalityLevel;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  contractReference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  contractStartDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  contractEndDate?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  contractValue?: number;

  @ApiPropertyOptional({ maxLength: 10 })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  autoRenewal?: boolean;

  @ApiPropertyOptional({ type: ContactDto, description: 'Primary contact (JSONB)' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactDto)
  primaryContact?: ContactDto;

  @ApiPropertyOptional({ type: ContactDto, description: 'Secondary contact (JSONB)' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactDto)
  secondaryContact?: ContactDto;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Website URL' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  riskAssessmentDate?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @IsString()
  riskLevel?: string;

  @ApiPropertyOptional({ type: [String], description: 'Compliance certifications (JSONB)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complianceCertifications?: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  insuranceVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  backgroundCheckDate?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  performanceRating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastReviewDate?: string;
}

