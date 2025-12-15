import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
  IsUUID,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CriticalityLevel, ConnectivityStatus, NetworkApprovalStatus } from '../entities/physical-asset.entity';

export class InstalledSoftwareDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  patch_level: string;
}

export class ActivePortsServicesDto {
  @ApiProperty()
  port: number;

  @ApiProperty()
  service: string;

  @ApiProperty()
  protocol: string;
}

export class SecurityTestResultsDto {
  @ApiProperty()
  last_test_date: Date;

  @ApiProperty()
  findings: string;

  @ApiProperty()
  severity: string;
}

export class CreatePhysicalAssetDto {
  @ApiProperty({ description: 'Asset type ID (FK to asset_types)' })
  @IsOptional()
  @IsUUID()
  assetTypeId?: string;

  @ApiProperty({ description: 'Asset description (VARCHAR 200, REQUIRED)', maxLength: 200 })
  @IsString()
  assetDescription: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  model?: string;

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

  @ApiProperty({ description: 'Unique identifier (VARCHAR 200, REQUIRED, UNIQUE)', maxLength: 200 })
  @IsString()
  uniqueIdentifier: string;

  @ApiPropertyOptional({ description: 'Physical location' })
  @IsOptional()
  @IsString()
  physicalLocation?: string;

  @ApiPropertyOptional({ enum: CriticalityLevel })
  @IsOptional()
  @IsEnum(CriticalityLevel)
  criticalityLevel?: CriticalityLevel;

  @ApiPropertyOptional({ type: [String], description: 'Array of MAC addresses (JSONB)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  macAddresses?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Array of IP addresses (JSONB)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ipAddresses?: string[];

  @ApiPropertyOptional({ type: [InstalledSoftwareDto], description: 'Installed software (JSONB)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstalledSoftwareDto)
  installedSoftware?: InstalledSoftwareDto[];

  @ApiPropertyOptional({ type: [ActivePortsServicesDto], description: 'Active ports and services (JSONB)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivePortsServicesDto)
  activePortsServices?: ActivePortsServicesDto[];

  @ApiPropertyOptional({ enum: NetworkApprovalStatus, default: NetworkApprovalStatus.PENDING })
  @IsOptional()
  @IsEnum(NetworkApprovalStatus)
  networkApprovalStatus?: NetworkApprovalStatus;

  @ApiPropertyOptional({ enum: ConnectivityStatus, default: ConnectivityStatus.UNKNOWN })
  @IsOptional()
  @IsEnum(ConnectivityStatus)
  connectivityStatus?: ConnectivityStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastConnectivityCheck?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  assetTag?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  warrantyExpiry?: string;

  @ApiPropertyOptional({ type: [String], description: 'Compliance requirements (JSONB)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complianceRequirements?: string[];

  @ApiPropertyOptional({ type: SecurityTestResultsDto, description: 'Security test results (JSONB)' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SecurityTestResultsDto)
  securityTestResults?: SecurityTestResultsDto;
}

