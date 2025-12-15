import { PartialType } from '@nestjs/swagger';
import { CreateInformationAssetDto } from './create-information-asset.dto';

export class UpdateInformationAssetDto extends PartialType(CreateInformationAssetDto) {}

