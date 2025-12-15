import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus, TaskType } from '../entities/task.entity';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: TaskType })
  taskType: TaskType;

  @ApiProperty({ enum: TaskPriority })
  priority: TaskPriority;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  dueDate: string;

  @ApiProperty({ required: false })
  assignedTo?: string;

  @ApiProperty({ required: false })
  relatedEntityType?: string;

  @ApiProperty({ required: false })
  relatedEntityId?: string;
}

