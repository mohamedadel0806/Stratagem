import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum AssetType {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  APPLICATION = 'application',
  SOFTWARE = 'software',
  SUPPLIER = 'supplier',
  ALL = 'all',
}

export class GlobalAssetSearchQueryDto {
  @ApiPropertyOptional({ description: 'Search query string', example: 'server' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Filter by asset type',
    enum: AssetType,
    example: AssetType.ALL,
  })
  @IsOptional()
  @IsEnum(AssetType)
  type?: AssetType;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by criticality level', example: 'high' })
  @IsOptional()
  @IsString()
  criticality?: string;

  @ApiPropertyOptional({ description: 'Filter by business unit', example: 'IT Department' })
  @IsOptional()
  @IsString()
  businessUnit?: string;
}

export class GlobalAssetSearchResultDto {
  @ApiProperty({ description: 'Asset ID' })
  id: string;

  @ApiProperty({ description: 'Asset type', enum: AssetType })
  type: AssetType;

  @ApiProperty({ description: 'Asset name/description' })
  name: string;

  @ApiProperty({ description: 'Asset identifier' })
  identifier: string;

  @ApiPropertyOptional({ description: 'Criticality level' })
  criticality?: string;

  @ApiPropertyOptional({ description: 'Owner name' })
  owner?: string;

  @ApiPropertyOptional({ description: 'Business unit' })
  businessUnit?: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}

export class GlobalAssetSearchResponseDto {
  @ApiProperty({ description: 'Search results', type: [GlobalAssetSearchResultDto] })
  data: GlobalAssetSearchResultDto[];

  @ApiProperty({ description: 'Total number of results' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;
}











