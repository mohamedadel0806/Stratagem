import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassificationLevel } from '../entities/information-asset.entity';

export class InformationAssetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uniqueIdentifier: string;

  @ApiProperty()
  informationType: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ClassificationLevel })
  classificationLevel: ClassificationLevel;

  @ApiPropertyOptional()
  classificationDate?: Date;

  @ApiPropertyOptional()
  reclassificationDate?: Date;

  @ApiPropertyOptional()
  reclassificationReminderSent?: boolean;

  @ApiPropertyOptional()
  informationOwnerId?: string;

  @ApiPropertyOptional()
  informationOwner?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };

  @ApiPropertyOptional()
  assetCustodianId?: string;

  @ApiPropertyOptional()
  assetCustodian?: {
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
  assetLocation?: string;

  @ApiPropertyOptional()
  storageMedium?: string;

  @ApiPropertyOptional({ type: [String] })
  complianceRequirements?: string[];

  @ApiPropertyOptional()
  retentionPeriod?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt?: Date;

  @ApiPropertyOptional({ description: 'Number of risks linked to this asset' })
  riskCount?: number;
}

