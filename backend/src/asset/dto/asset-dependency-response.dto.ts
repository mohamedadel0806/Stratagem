import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssetType, RelationshipType } from '../entities/asset-dependency.entity';

export class AssetDependencyResponseDto {
  @ApiProperty({ description: 'Dependency ID' })
  id: string;

  @ApiProperty({ description: 'Source asset type', enum: AssetType })
  sourceAssetType: AssetType;

  @ApiProperty({ description: 'Source asset ID' })
  sourceAssetId: string;

  @ApiProperty({ description: 'Source asset name' })
  sourceAssetName: string;

  @ApiProperty({ description: 'Source asset identifier' })
  sourceAssetIdentifier: string;

  @ApiProperty({ description: 'Target asset type', enum: AssetType })
  targetAssetType: AssetType;

  @ApiProperty({ description: 'Target asset ID' })
  targetAssetId: string;

  @ApiProperty({ description: 'Target asset name' })
  targetAssetName: string;

  @ApiProperty({ description: 'Target asset identifier' })
  targetAssetIdentifier: string;

  @ApiProperty({ description: 'Relationship type', enum: RelationshipType })
  relationshipType: RelationshipType;

  @ApiPropertyOptional({ description: 'Description' })
  description?: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}









