import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CriticalityLevel, ConnectivityStatus } from '../entities/physical-asset.entity';

export class PhysicalAssetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Asset type ID (UUID)' })
  @IsOptional()
  @IsUUID()
  assetType?: string;

  @ApiProperty({ enum: CriticalityLevel, required: false })
  @IsOptional()
  @IsEnum(CriticalityLevel)
  criticalityLevel?: CriticalityLevel;

  @ApiProperty({ enum: ConnectivityStatus, required: false })
  @IsOptional()
  @IsEnum(ConnectivityStatus)
  connectivityStatus?: ConnectivityStatus;

  @ApiProperty({ required: false, description: 'Business unit ID (UUID)' })
  @IsOptional()
  @IsUUID()
  businessUnit?: string;

  @ApiProperty({ required: false, description: 'Owner ID (UUID)' })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiProperty({ required: false, description: 'Filter by dependency status: true for assets with dependencies, false for assets without dependencies' })
  @IsOptional()
  @Type(() => Boolean)
  hasDependencies?: boolean;

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

