import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from '../services/tasks.service';
import { TaskResponseDto } from '../dto/task-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'status', required: false, enum: ['todo', 'in_progress', 'review', 'completed', 'cancelled'] })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [TaskResponseDto] })
  async findAll(
    @Query('status') status?: string,
    @CurrentUser() user?: User,
  ): Promise<TaskResponseDto[]> {
    if (status === 'pending') {
      return this.tasksService.findPending(user?.id);
    }
    return this.tasksService.findAll(user?.id);
  }
}

