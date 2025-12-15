import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject, IsInt, Min, Max } from 'class-validator';
import { WorkflowType, WorkflowTrigger, EntityType } from '../entities/workflow.entity';

export class CreateWorkflowDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: WorkflowType })
  @IsEnum(WorkflowType)
  type: WorkflowType;

  @ApiProperty({ enum: WorkflowTrigger })
  @IsEnum(WorkflowTrigger)
  trigger: WorkflowTrigger;

  @ApiProperty({ enum: EntityType })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;

  @ApiProperty({ type: Object })
  @IsObject()
  actions: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  daysBeforeDeadline?: number;
}

