import { TasksService } from '../services/tasks.service';
import { TaskResponseDto } from '../dto/task-response.dto';
import { User } from '../../users/entities/user.entity';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(status?: string, user?: User): Promise<TaskResponseDto[]>;
}
