import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssetCategory } from '../entities/asset-type.entity';

export class CreateAssetTypeDto {
    @ApiProperty({ enum: AssetCategory })
    @IsEnum(AssetCategory)
    category: AssetCategory;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
