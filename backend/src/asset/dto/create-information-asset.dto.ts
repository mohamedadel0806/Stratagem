import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString, IsArray, IsUUID } from 'class-validator';
import { ClassificationLevel } from '../entities/information-asset.entity';

export class CreateInformationAssetDto {
  @ApiPropertyOptional({ description: 'Unique identifier (auto-generated if not provided)', maxLength: 200 })
  @IsOptional()
  @IsString()
  uniqueIdentifier?: string;

  @ApiProperty({ description: 'Information type (VARCHAR 200, REQUIRED)', maxLength: 200 })
  @IsString()
  informationType: string;

  @ApiProperty({ description: 'Asset name (VARCHAR 300, REQUIRED)', maxLength: 300 })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ClassificationLevel })
  @IsEnum(ClassificationLevel)
  classificationLevel: ClassificationLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  classificationDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  reclassificationDate?: string;

  @ApiPropertyOptional({ description: 'Information owner ID (FK to users)' })
  @IsOptional()
  @IsUUID()
  informationOwnerId?: string;

  @ApiPropertyOptional({ description: 'Asset custodian ID (FK to users)' })
  @IsOptional()
  @IsUUID()
  assetCustodianId?: string;

  @ApiPropertyOptional({ description: 'Business unit ID (FK to business_units)' })
  @IsOptional()
  @IsUUID()
  businessUnitId?: string;

  @ApiPropertyOptional({ description: 'Asset location' })
  @IsOptional()
  @IsString()
  assetLocation?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  storageMedium?: string;

  @ApiPropertyOptional({ type: [String], description: 'Compliance requirements (JSONB)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complianceRequirements?: string[];

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  retentionPeriod?: string;
}

