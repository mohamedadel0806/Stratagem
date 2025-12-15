import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SoftwareAssetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uniqueIdentifier: string;

  @ApiProperty()
  softwareName: string;

  @ApiPropertyOptional()
  softwareType?: string;

  @ApiPropertyOptional()
  versionNumber?: string;

  @ApiPropertyOptional()
  patchLevel?: string;

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

  @ApiPropertyOptional()
  vendorName?: string;

  @ApiPropertyOptional({ type: Object })
  vendorContact?: {
    name: string;
    email: string;
    phone: string;
  };

  @ApiPropertyOptional()
  licenseType?: string;

  @ApiPropertyOptional()
  licenseCount?: number;

  @ApiPropertyOptional()
  licenseKey?: string;

  @ApiPropertyOptional()
  licenseExpiry?: Date;

  @ApiPropertyOptional()
  installationCount?: number;

  @ApiPropertyOptional({ type: Object })
  securityTestResults?: {
    last_test_date: Date;
    findings: string;
    severity: string;
  };

  @ApiPropertyOptional()
  lastSecurityTestDate?: Date;

  @ApiPropertyOptional({ type: Array })
  knownVulnerabilities?: Array<{
    cve_id: string;
    severity: string;
    description: string;
    patch_available: boolean;
  }>;

  @ApiPropertyOptional()
  supportEndDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt?: Date;

  @ApiPropertyOptional({ description: 'Number of risks linked to this asset' })
  riskCount?: number;
}

