import { ApiProperty } from '@nestjs/swagger';
import { WorkflowType, WorkflowStatus, WorkflowTrigger, EntityType } from '../entities/workflow.entity';

export class WorkflowResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: WorkflowType })
  type: WorkflowType;

  @ApiProperty({ enum: WorkflowStatus })
  status: WorkflowStatus;

  @ApiProperty({ enum: WorkflowTrigger })
  trigger: WorkflowTrigger;

  @ApiProperty({ enum: EntityType })
  entityType: EntityType;

  @ApiProperty({ required: false, type: Object })
  conditions?: Record<string, any>;

  @ApiProperty({ type: Object })
  actions: Record<string, any>;

  @ApiProperty({ required: false })
  daysBeforeDeadline?: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

