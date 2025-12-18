import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailDistributionListDto } from './create-email-distribution-list.dto';

export class UpdateEmailDistributionListDto extends PartialType(CreateEmailDistributionListDto) {}

