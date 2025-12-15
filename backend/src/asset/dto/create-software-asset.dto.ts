import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray, IsUUID, IsInt, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

export class KnownVulnerabilityDto {
  @ApiProperty()
  cve_id: string;

  @ApiProperty()
  severity: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  patch_available: boolean;
}

export class CreateSoftwareAssetDto {
  @ApiPropertyOptional({ description: 'Unique identifier (auto-generated if not provided)', maxLength: 200 })
  @IsOptional()
  @IsString()
  uniqueIdentifier?: string;

  @ApiProperty({ description: 'Software name (VARCHAR 300, REQUIRED)', maxLength: 300 })
  @IsString()
  softwareName: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  softwareType?: string;

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

  @ApiPropertyOptional({ description: 'License key (encrypted)' })
  @IsOptional()
  @IsString()
  licenseKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  licenseExpiry?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  installationCount?: number;

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

  @ApiPropertyOptional({ type: [KnownVulnerabilityDto], description: 'Known vulnerabilities (JSONB)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KnownVulnerabilityDto)
  knownVulnerabilities?: KnownVulnerabilityDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  supportEndDate?: string;
}

