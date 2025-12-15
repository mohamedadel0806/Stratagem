import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class SoftwareAssetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Software type (string)' })
  @IsOptional()
  @IsString()
  softwareType?: string;

  @ApiProperty({ required: false, description: 'Vendor name' })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiProperty({ required: false, description: 'Business unit ID (UUID)' })
  @IsOptional()
  @IsUUID()
  businessUnit?: string;

  @ApiProperty({ required: false, description: 'Owner ID (UUID)' })
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

