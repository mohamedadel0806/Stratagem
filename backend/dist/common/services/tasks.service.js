"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("../entities/task.entity");
let TasksService = class TasksService {
    constructor(tasksRepository) {
        this.tasksRepository = tasksRepository;
    }
    async findPending(userId) {
        const query = this.tasksRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.assignedTo', 'assignedTo')
            .where('task.status IN (:...statuses)', {
            statuses: [task_entity_1.TaskStatus.TODO, task_entity_1.TaskStatus.IN_PROGRESS, task_entity_1.TaskStatus.REVIEW],
        })
            .orderBy('task."dueDate"', 'ASC')
            .addOrderBy('task.priority', 'DESC');
        if (userId) {
            query.andWhere('task.assignedToId = :userId', { userId });
        }
        const tasks = await query.getMany();
        return tasks.map((task) => this.toResponseDto(task));
    }
    async findAll(userId) {
        const query = this.tasksRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.assignedTo', 'assignedTo')
            .orderBy('task.createdAt', 'DESC');
        if (userId) {
            query.andWhere('task.assignedToId = :userId', { userId });
        }
        const tasks = await query.getMany();
        return tasks.map((task) => this.toResponseDto(task));
    }
    toResponseDto(task) {
        var _a, _b;
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            taskType: task.taskType,
            priority: task.priority,
            status: task.status,
            dueDate: ((_a = task.dueDate) === null || _a === void 0 ? void 0 : _a.toISOString()) || new Date().toISOString(),
            assignedTo: (_b = task.assignedTo) === null || _b === void 0 ? void 0 : _b.email,
            relatedEntityType: task.relatedEntityType,
            relatedEntityId: task.relatedEntityId,
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map