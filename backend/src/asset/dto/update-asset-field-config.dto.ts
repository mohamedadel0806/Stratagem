import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetFieldConfigDto } from './create-asset-field-config.dto';

export class UpdateAssetFieldConfigDto extends PartialType(CreateAssetFieldConfigDto) {}








