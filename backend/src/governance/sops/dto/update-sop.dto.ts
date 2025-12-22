import { PartialType } from '@nestjs/swagger';
import { CreateSOPDto } from './create-sop.dto';

export class UpdateSOPDto extends PartialType(CreateSOPDto) {}


