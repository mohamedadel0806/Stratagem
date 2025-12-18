import { PartialType } from '@nestjs/mapped-types';
import { CreateValidationRuleDto } from './create-validation-rule.dto';

export class UpdateValidationRuleDto extends PartialType(CreateValidationRuleDto) {}

