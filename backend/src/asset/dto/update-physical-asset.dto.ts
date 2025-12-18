import { PartialType } from '@nestjs/swagger';
import { CreatePhysicalAssetDto } from './create-physical-asset.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePhysicalAssetDto extends PartialType(CreatePhysicalAssetDto) {
  @IsString()
  @IsOptional()
  changeReason?: string;
}

