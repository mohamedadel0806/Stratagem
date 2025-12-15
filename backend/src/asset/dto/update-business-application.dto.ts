import { PartialType } from '@nestjs/swagger';
import { CreateBusinessApplicationDto } from './create-business-application.dto';

export class UpdateBusinessApplicationDto extends PartialType(CreateBusinessApplicationDto) {}

