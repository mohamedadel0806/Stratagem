import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsUUID,
  IsBoolean,
  IsInt,
  MaxLength,
} from 'class-validator';
import { ImplementationStatus } from '../entities/control-objective.entity';

export class CreateControlObjectiveDto {
  @IsString()
  @MaxLength(100)
  objective_identifier: string;

  @IsUUID()
  policy_id: string;

  @IsString()
  statement: string;

  @IsOptional()
  @IsString()
  rationale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  domain?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  priority?: string;

  @IsOptional()
  @IsBoolean()
  mandatory?: boolean;

  @IsOptional()
  @IsUUID()
  responsible_party_id?: string;

  @IsOptional()
  implementation_status?: ImplementationStatus;

  @IsOptional()
  @IsDateString()
  target_implementation_date?: string;

  @IsOptional()
  @IsDateString()
  actual_implementation_date?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  linked_influencers?: string[];

  @IsOptional()
  @IsInt()
  display_order?: number;
}




