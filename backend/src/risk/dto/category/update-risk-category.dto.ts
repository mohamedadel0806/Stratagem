import { PartialType } from '@nestjs/mapped-types';
import { CreateRiskCategoryDto } from './create-risk-category.dto';

export class UpdateRiskCategoryDto extends PartialType(CreateRiskCategoryDto) {}





