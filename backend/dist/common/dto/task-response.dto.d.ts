import { TaskPriority, TaskStatus, TaskType } from '../entities/task.entity';
export declare class TaskResponseDto {
    id: string;
    title: string;
    description?: string;
    taskType: TaskType;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    assignedTo?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
}
