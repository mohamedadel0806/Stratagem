import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ClassificationLevel } from '../entities/information-asset.entity';

export class InformationAssetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: ClassificationLevel, required: false })
  @IsOptional()
  @IsEnum(ClassificationLevel)
  dataClassification?: ClassificationLevel;

  @ApiProperty({ required: false, description: 'Filter by compliance requirement (e.g., ISO 27001, SOC 2)' })
  @IsOptional()
  @IsString()
  complianceRequirement?: string;

  @ApiProperty({ required: false, description: 'Business unit ID (UUID)' })
  @IsOptional()
  @IsUUID()
  businessUnit?: string;

  @ApiProperty({ required: false, description: 'Information owner ID (UUID)' })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

