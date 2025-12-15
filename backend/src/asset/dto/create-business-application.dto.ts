import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString, IsArray, IsUUID, IsInt, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CriticalityLevel } from '../entities/business-application.entity';
import { ClassificationLevel } from '../entities/information-asset.entity';

export class VendorContactDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;
}

export class SecurityTestResultsDto {
  @ApiProperty()
  last_test_date: Date;

  @ApiProperty()
  findings: string;

  @ApiProperty()
  severity: string;
}

export class CreateBusinessApplicationDto {
  @ApiPropertyOptional({ description: 'Unique identifier (auto-generated if not provided)', maxLength: 200 })
  @IsOptional()
  @IsString()
  uniqueIdentifier?: string;

  @ApiProperty({ description: 'Application name (VARCHAR 300, REQUIRED)', maxLength: 300 })
  @IsString()
  applicationName: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  applicationType?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  versionNumber?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  patchLevel?: string;

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

  @ApiPropertyOptional({ type: [String], description: 'Data processed (JSONB)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dataProcessed?: string[];

  @ApiPropertyOptional({ enum: ClassificationLevel })
  @IsOptional()
  @IsEnum(ClassificationLevel)
  dataClassification?: ClassificationLevel;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  vendorName?: string;

  @ApiPropertyOptional({ type: VendorContactDto, description: 'Vendor contact (JSONB)' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => VendorContactDto)
  vendorContact?: VendorContactDto;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  licenseType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  licenseCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  licenseExpiry?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  hostingType?: string;

  @ApiPropertyOptional({ description: 'Hosting location' })
  @IsOptional()
  @IsString()
  hostingLocation?: string;

  @ApiPropertyOptional({ description: 'Access URL' })
  @IsOptional()
  @IsString()
  accessUrl?: string;

  @ApiPropertyOptional({ type: SecurityTestResultsDto, description: 'Security test results (JSONB)' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SecurityTestResultsDto)
  securityTestResults?: SecurityTestResultsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastSecurityTestDate?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  authenticationMethod?: string;

  @ApiPropertyOptional({ type: [String], description: 'Compliance requirements (JSONB)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complianceRequirements?: string[];

  @ApiPropertyOptional({ enum: CriticalityLevel })
  @IsOptional()
  @IsEnum(CriticalityLevel)
  criticalityLevel?: CriticalityLevel;
}

