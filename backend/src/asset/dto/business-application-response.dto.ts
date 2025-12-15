import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CriticalityLevel } from '../entities/business-application.entity';
import { ClassificationLevel } from '../entities/information-asset.entity';

export class BusinessApplicationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uniqueIdentifier: string;

  @ApiProperty()
  applicationName: string;

  @ApiPropertyOptional()
  applicationType?: string;

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

  @ApiPropertyOptional({ type: [String] })
  dataProcessed?: string[];

  @ApiPropertyOptional({ enum: ClassificationLevel })
  dataClassification?: ClassificationLevel;

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
  licenseExpiry?: Date;

  @ApiPropertyOptional()
  hostingType?: string;

  @ApiPropertyOptional()
  hostingLocation?: string;

  @ApiPropertyOptional()
  accessUrl?: string;

  @ApiPropertyOptional({ type: Object })
  securityTestResults?: {
    last_test_date: Date;
    findings: string;
    severity: string;
  };

  @ApiPropertyOptional()
  lastSecurityTestDate?: Date;

  @ApiPropertyOptional()
  authenticationMethod?: string;

  @ApiPropertyOptional({ type: [String] })
  complianceRequirements?: string[];

  @ApiPropertyOptional({ enum: CriticalityLevel })
  criticalityLevel?: CriticalityLevel;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt?: Date;

  @ApiPropertyOptional({ description: 'Number of risks linked to this asset' })
  riskCount?: number;
}

