import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CriticalityLevel,
  ConnectivityStatus,
  NetworkApprovalStatus,
} from '../entities/physical-asset.entity';

export class PhysicalAssetResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  assetTypeId?: string;

  @ApiPropertyOptional()
  assetType?: {
    id: string;
    name: string;
    category: string;
  };

  @ApiProperty()
  assetDescription: string;

  @ApiPropertyOptional()
  manufacturer?: string;

  @ApiPropertyOptional()
  model?: string;

  @ApiPropertyOptional()
  businessPurpose?: string;

  @ApiPropertyOptional()
  ownerId?: string;

  @ApiPropertyOptional()
  owner?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };

  @ApiPropertyOptional()
  businessUnitId?: string;

  @ApiPropertyOptional()
  businessUnit?: {
    id: string;
    name: string;
    code?: string;
  };

  @ApiProperty()
  uniqueIdentifier: string;

  @ApiPropertyOptional()
  physicalLocation?: string;

  @ApiPropertyOptional({ enum: CriticalityLevel })
  criticalityLevel?: CriticalityLevel;

  @ApiPropertyOptional({ type: [String] })
  macAddresses?: string[];

  @ApiPropertyOptional({ type: [String] })
  ipAddresses?: string[];

  @ApiPropertyOptional({ type: Array, description: 'Installed software (JSONB)' })
  installedSoftware?: Array<{
    name: string;
    version: string;
    patch_level: string;
  }>;

  @ApiPropertyOptional({ type: Array, description: 'Active ports and services (JSONB)' })
  activePortsServices?: Array<{
    port: number;
    service: string;
    protocol: string;
  }>;

  @ApiPropertyOptional({ enum: NetworkApprovalStatus })
  networkApprovalStatus?: NetworkApprovalStatus;

  @ApiPropertyOptional({ enum: ConnectivityStatus })
  connectivityStatus?: ConnectivityStatus;

  @ApiPropertyOptional()
  lastConnectivityCheck?: Date;

  @ApiPropertyOptional()
  serialNumber?: string;

  @ApiPropertyOptional()
  assetTag?: string;

  @ApiPropertyOptional()
  purchaseDate?: Date;

  @ApiPropertyOptional()
  warrantyExpiry?: Date;

  @ApiPropertyOptional({ type: [String] })
  complianceRequirements?: string[];

  @ApiPropertyOptional({ type: Object })
  securityTestResults?: {
    last_test_date: Date;
    findings: string;
    severity: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt?: Date;

  @ApiPropertyOptional({ description: 'Number of risks linked to this asset' })
  riskCount?: number;
}

