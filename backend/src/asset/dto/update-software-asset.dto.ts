import { PartialType } from '@nestjs/swagger';
import { CreateSoftwareAssetDto } from './create-software-asset.dto';

export class UpdateSoftwareAssetDto extends PartialType(CreateSoftwareAssetDto) {}

