import { PartialType } from '@nestjs/mapped-types';
import { CreateKRIDto } from './create-kri.dto';

export class UpdateKRIDto extends PartialType(CreateKRIDto) {}




