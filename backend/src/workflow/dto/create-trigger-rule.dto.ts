import { IsString, IsOptional, IsEnum, IsArray, IsUUID, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityType, WorkflowTrigger } from '../entities/workflow.entity';
import { RuleOperator } from '../entities/workflow-trigger-rule.entity';

export class TriggerConditionDto {
  @IsString()
  field: string;

  @IsEnum(RuleOperator)
  operator: RuleOperator;

  @IsOptional()
  value: any;
}

export class CreateWorkflowTriggerRuleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(EntityType)
  entityType: EntityType;

  @IsEnum(WorkflowTrigger)
  trigger: WorkflowTrigger;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TriggerConditionDto)
  conditions: TriggerConditionDto[];

  @IsUUID()
  workflowId: string;

  @IsInt()
  @IsOptional()
  priority?: number;

  @IsOptional()
  isActive?: boolean;
}


