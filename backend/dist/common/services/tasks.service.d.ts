import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskResponseDto } from '../dto/task-response.dto';
export declare class TasksService {
    private tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    findPending(userId?: string): Promise<TaskResponseDto[]>;
    findAll(userId?: string): Promise<TaskResponseDto[]>;
    private toResponseDto;
}
