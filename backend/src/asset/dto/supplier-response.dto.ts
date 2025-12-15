import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CriticalityLevel } from '../entities/physical-asset.entity';

export class SupplierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uniqueIdentifier: string;

  @ApiProperty()
  supplierName: string;

  @ApiPropertyOptional()
  supplierType?: string;

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
  goodsServicesType?: string[];

  @ApiPropertyOptional({ enum: CriticalityLevel })
  criticalityLevel?: CriticalityLevel;

  @ApiPropertyOptional()
  contractReference?: string;

  @ApiPropertyOptional()
  contractStartDate?: Date;

  @ApiPropertyOptional()
  contractEndDate?: Date;

  @ApiPropertyOptional()
  contractValue?: number;

  @ApiPropertyOptional()
  currency?: string;

  @ApiPropertyOptional()
  autoRenewal?: boolean;

  @ApiPropertyOptional({ type: Object })
  primaryContact?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };

  @ApiPropertyOptional({ type: Object })
  secondaryContact?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };

  @ApiPropertyOptional()
  taxId?: string;

  @ApiPropertyOptional()
  registrationNumber?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  riskAssessmentDate?: Date;

  @ApiPropertyOptional()
  riskLevel?: string;

  @ApiPropertyOptional({ type: [String] })
  complianceCertifications?: string[];

  @ApiPropertyOptional()
  insuranceVerified?: boolean;

  @ApiPropertyOptional()
  backgroundCheckDate?: Date;

  @ApiPropertyOptional()
  performanceRating?: number;

  @ApiPropertyOptional()
  lastReviewDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt?: Date;

  @ApiPropertyOptional({ description: 'Number of risks linked to this asset' })
  riskCount?: number;
}

