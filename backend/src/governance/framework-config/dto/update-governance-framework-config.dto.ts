import { PartialType } from '@nestjs/mapped-types';
import { CreateGovernanceFrameworkConfigDto } from './create-governance-framework-config.dto';

export class UpdateGovernanceFrameworkConfigDto extends PartialType(
  CreateGovernanceFrameworkConfigDto,
) {}
