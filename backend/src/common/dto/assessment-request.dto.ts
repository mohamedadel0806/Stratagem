import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

export class BulkAssessRequestDto {
  @ApiProperty({ enum: ['physical', 'information', 'application', 'software', 'supplier'] })
  @IsEnum(['physical', 'information', 'application', 'software', 'supplier'])
  assetType: AssetType;

  @ApiProperty({ type: [String], description: 'Array of asset IDs to assess' })
  @IsArray()
  @IsUUID('4', { each: true })
  assetIds: string[];
}

export class AssessAssetRequestDto {
  @ApiProperty({ enum: ['physical', 'information', 'application', 'software', 'supplier'] })
  @IsEnum(['physical', 'information', 'application', 'software', 'supplier'])
  assetType: AssetType;

  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiPropertyOptional({ description: 'Specific requirement ID to assess (optional)' })
  @IsOptional()
  @IsUUID()
  requirementId?: string;
}











