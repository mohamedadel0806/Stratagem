import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { TaskResponseDto } from '../dto/task-response.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findPending(userId?: string): Promise<TaskResponseDto[]> {
    try {
      const query = this.tasksRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.assignedTo', 'assignedTo')
        .where('task.status IN (:...statuses)', {
          statuses: [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW],
        })
        .orderBy('task.dueDate', 'ASC')
        .addOrderBy('task.priority', 'DESC');

      if (userId) {
        query.andWhere('task.assignedToId = :userId', { userId });
      }

      const tasks = await query.getMany();

      return tasks.map((task) => this.toResponseDto(task));
    } catch (error) {
      console.error('Error in findPending:', error);
      // Return empty array instead of throwing to prevent breaking the dashboard
      return [];
    }
  }

  async findAll(userId?: string): Promise<TaskResponseDto[]> {
    try {
      const query = this.tasksRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.assignedTo', 'assignedTo')
        .orderBy('task.createdAt', 'DESC');

      if (userId) {
        query.andWhere('task.assignedToId = :userId', { userId });
      }

      const tasks = await query.getMany();
      return tasks.map((task) => this.toResponseDto(task));
    } catch (error) {
      console.error('Error in findAll:', error);
      // Return empty array instead of throwing to prevent breaking the dashboard
      return [];
    }
  }

  private toResponseDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      taskType: task.taskType,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate?.toISOString() || new Date().toISOString(),
      assignedTo: task.assignedTo?.email,
      relatedEntityType: task.relatedEntityType,
      relatedEntityId: task.relatedEntityId,
    };
  }
}

