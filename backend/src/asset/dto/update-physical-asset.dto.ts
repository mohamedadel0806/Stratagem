import { PartialType } from '@nestjs/swagger';
import { CreatePhysicalAssetDto } from './create-physical-asset.dto';

export class UpdatePhysicalAssetDto extends PartialType(CreatePhysicalAssetDto) {}

