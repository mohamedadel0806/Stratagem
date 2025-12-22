import { IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ImportControlItem {
  control_identifier: string;
  title: string;
  domain?: string;
  control_type?: string;
  complexity?: string;
  cost_impact?: string;
  description?: string;
  control_procedures?: string;
  testing_procedures?: string;
}

export class ImportControlsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportControlItem)
  controls: ImportControlItem[];
}
