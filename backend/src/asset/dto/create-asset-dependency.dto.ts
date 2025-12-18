import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsString, IsOptional } from 'class-validator';
import { AssetType, RelationshipType } from '../entities/asset-dependency.entity';

export class CreateAssetDependencyDto {
  @ApiProperty({
    description: 'Target asset type',
    enum: AssetType,
    example: AssetType.PHYSICAL,
  })
  @IsEnum(AssetType)
  targetAssetType: AssetType;

  @ApiProperty({
    description: 'Target asset ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  targetAssetId: string;

  @ApiProperty({
    description: 'Relationship type',
    enum: RelationshipType,
    example: RelationshipType.DEPENDS_ON,
    default: RelationshipType.DEPENDS_ON,
  })
  @IsEnum(RelationshipType)
  relationshipType: RelationshipType;

  @ApiPropertyOptional({
    description: 'Description of the dependency',
    example: 'Application depends on this database server',
  })
  @IsOptional()
  @IsString()
  description?: string;
}









