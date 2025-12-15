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
exports.RiskTreatmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_treatment_entity_1 = require("../entities/risk-treatment.entity");
const treatment_task_entity_1 = require("../entities/treatment-task.entity");
const risk_entity_1 = require("../entities/risk.entity");
let RiskTreatmentService = class RiskTreatmentService {
    constructor(treatmentRepository, taskRepository, riskRepository) {
        this.treatmentRepository = treatmentRepository;
        this.taskRepository = taskRepository;
        this.riskRepository = riskRepository;
    }
    async findAll(filters) {
        const where = {};
        if (filters === null || filters === void 0 ? void 0 : filters.status)
            where.status = filters.status;
        if (filters === null || filters === void 0 ? void 0 : filters.priority)
            where.priority = filters.priority;
        if (filters === null || filters === void 0 ? void 0 : filters.ownerId)
            where.treatment_owner_id = filters.ownerId;
        if (filters === null || filters === void 0 ? void 0 : filters.riskId)
            where.risk_id = filters.riskId;
        const treatments = await this.treatmentRepository.find({
            where,
            relations: ['treatment_owner', 'risk', 'tasks'],
            order: { target_completion_date: 'ASC', priority: 'ASC' },
        });
        return treatments.map(t => this.toResponseDto(t));
    }
    async findByRiskId(riskId) {
        const treatments = await this.treatmentRepository.find({
            where: { risk_id: riskId },
            relations: ['treatment_owner', 'tasks'],
            order: { created_at: 'DESC' },
        });
        return treatments.map(t => this.toResponseDto(t));
    }
    async findOne(id) {
        const treatment = await this.treatmentRepository.findOne({
            where: { id },
            relations: ['treatment_owner', 'risk', 'tasks', 'tasks.assignee'],
        });
        if (!treatment) {
            throw new common_1.NotFoundException(`Risk treatment with ID ${id} not found`);
        }
        return this.toResponseDto(treatment);
    }
    async create(createDto, userId) {
        const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
        }
        const treatment = this.treatmentRepository.create(Object.assign(Object.assign({}, createDto), { start_date: createDto.start_date ? new Date(createDto.start_date) : undefined, target_completion_date: createDto.target_completion_date ? new Date(createDto.target_completion_date) : undefined, created_by: userId }));
        const savedTreatment = await this.treatmentRepository.save(treatment);
        const fullTreatment = await this.treatmentRepository.findOne({
            where: { id: savedTreatment.id },
            relations: ['treatment_owner', 'risk', 'tasks'],
        });
        return this.toResponseDto(fullTreatment);
    }
    async update(id, updateDto, userId) {
        const treatment = await this.treatmentRepository.findOne({
            where: { id },
            relations: ['tasks'],
        });
        if (!treatment) {
            throw new common_1.NotFoundException(`Risk treatment with ID ${id} not found`);
        }
        const updateData = Object.assign(Object.assign({}, updateDto), { updated_by: userId });
        if (updateDto.start_date)
            updateData.start_date = new Date(updateDto.start_date);
        if (updateDto.target_completion_date)
            updateData.target_completion_date = new Date(updateDto.target_completion_date);
        if (updateDto.actual_completion_date)
            updateData.actual_completion_date = new Date(updateDto.actual_completion_date);
        Object.assign(treatment, updateData);
        const updatedTreatment = await this.treatmentRepository.save(treatment);
        const fullTreatment = await this.treatmentRepository.findOne({
            where: { id: updatedTreatment.id },
            relations: ['treatment_owner', 'risk', 'tasks'],
        });
        return this.toResponseDto(fullTreatment);
    }
    async updateProgress(id, progress, notes, userId) {
        const treatment = await this.treatmentRepository.findOne({ where: { id } });
        if (!treatment) {
            throw new common_1.NotFoundException(`Risk treatment with ID ${id} not found`);
        }
        treatment.progress_percentage = progress;
        if (notes)
            treatment.progress_notes = notes;
        treatment.updated_by = userId;
        if (progress === 100 && treatment.status !== risk_treatment_entity_1.TreatmentStatus.COMPLETED) {
            treatment.status = risk_treatment_entity_1.TreatmentStatus.COMPLETED;
            treatment.actual_completion_date = new Date();
        }
        const updatedTreatment = await this.treatmentRepository.save(treatment);
        const fullTreatment = await this.treatmentRepository.findOne({
            where: { id: updatedTreatment.id },
            relations: ['treatment_owner', 'risk', 'tasks'],
        });
        return this.toResponseDto(fullTreatment);
    }
    async remove(id) {
        const treatment = await this.treatmentRepository.findOne({ where: { id } });
        if (!treatment) {
            throw new common_1.NotFoundException(`Risk treatment with ID ${id} not found`);
        }
        await this.treatmentRepository.softDelete(id);
    }
    async addTask(treatmentId, taskData) {
        const treatment = await this.treatmentRepository.findOne({ where: { id: treatmentId } });
        if (!treatment) {
            throw new common_1.NotFoundException(`Risk treatment with ID ${treatmentId} not found`);
        }
        const maxOrder = await this.taskRepository
            .createQueryBuilder('task')
            .where('task.treatment_id = :treatmentId', { treatmentId })
            .select('MAX(task.display_order)', 'max')
            .getRawOne();
        const task = this.taskRepository.create({
            treatment_id: treatmentId,
            title: taskData.title,
            description: taskData.description,
            assignee_id: taskData.assignee_id,
            due_date: taskData.due_date ? new Date(taskData.due_date) : undefined,
            display_order: ((maxOrder === null || maxOrder === void 0 ? void 0 : maxOrder.max) || 0) + 1,
        });
        const savedTask = await this.taskRepository.save(task);
        return this.toTaskResponseDto(savedTask);
    }
    async updateTask(taskId, taskData) {
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new common_1.NotFoundException(`Treatment task with ID ${taskId} not found`);
        }
        Object.assign(task, taskData);
        if (taskData.due_date)
            task.due_date = new Date(taskData.due_date);
        if (taskData.status === 'completed')
            task.completed_date = new Date();
        const updatedTask = await this.taskRepository.save(task);
        return this.toTaskResponseDto(updatedTask);
    }
    async removeTask(taskId) {
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new common_1.NotFoundException(`Treatment task with ID ${taskId} not found`);
        }
        await this.taskRepository.remove(task);
    }
    async getOverdueTreatments() {
        const treatments = await this.treatmentRepository.find({
            where: {
                status: (0, typeorm_2.In)([risk_treatment_entity_1.TreatmentStatus.PLANNED, risk_treatment_entity_1.TreatmentStatus.IN_PROGRESS]),
                target_completion_date: (0, typeorm_2.LessThan)(new Date()),
            },
            relations: ['treatment_owner', 'risk'],
            order: { target_completion_date: 'ASC' },
        });
        return treatments.map(t => this.toResponseDto(t));
    }
    async getTreatmentsDueSoon(days = 7) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        const treatments = await this.treatmentRepository.find({
            where: {
                status: (0, typeorm_2.In)([risk_treatment_entity_1.TreatmentStatus.PLANNED, risk_treatment_entity_1.TreatmentStatus.IN_PROGRESS]),
                target_completion_date: (0, typeorm_2.Between)(today, futureDate),
            },
            relations: ['treatment_owner', 'risk'],
            order: { target_completion_date: 'ASC' },
        });
        return treatments.map(t => this.toResponseDto(t));
    }
    async getTreatmentSummary() {
        const treatments = await this.treatmentRepository.find();
        const today = new Date();
        const summary = {
            total: treatments.length,
            by_status: {},
            by_priority: {},
            overdue: 0,
            completion_rate: 0,
        };
        let completed = 0;
        for (const t of treatments) {
            summary.by_status[t.status] = (summary.by_status[t.status] || 0) + 1;
            summary.by_priority[t.priority] = (summary.by_priority[t.priority] || 0) + 1;
            if (t.target_completion_date && t.target_completion_date < today &&
                t.status !== risk_treatment_entity_1.TreatmentStatus.COMPLETED && t.status !== risk_treatment_entity_1.TreatmentStatus.CANCELLED) {
                summary.overdue++;
            }
            if (t.status === risk_treatment_entity_1.TreatmentStatus.COMPLETED) {
                completed++;
            }
        }
        summary.completion_rate = treatments.length > 0
            ? Math.round((completed / treatments.length) * 100)
            : 0;
        return summary;
    }
    toResponseDto(treatment) {
        var _a;
        const today = new Date();
        let dueStatus = 'on_track';
        if (treatment.status === risk_treatment_entity_1.TreatmentStatus.COMPLETED) {
            dueStatus = 'completed';
        }
        else if (treatment.target_completion_date) {
            const dueDate = new Date(treatment.target_completion_date);
            const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilDue < 0) {
                dueStatus = 'overdue';
            }
            else if (daysUntilDue <= 7) {
                dueStatus = 'due_soon';
            }
        }
        const tasks = treatment.tasks || [];
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const toISOString = (date) => {
            if (!date)
                return undefined;
            if (typeof date === 'string')
                return date;
            if (date instanceof Date)
                return date.toISOString();
            if (typeof date.toISOString === 'function')
                return date.toISOString();
            return undefined;
        };
        return {
            id: treatment.id,
            treatment_id: treatment.treatment_id,
            risk_id: treatment.risk_id,
            risk_title: (_a = treatment.risk) === null || _a === void 0 ? void 0 : _a.title,
            strategy: treatment.strategy,
            title: treatment.title,
            description: treatment.description,
            treatment_owner_id: treatment.treatment_owner_id,
            treatment_owner_name: treatment.treatment_owner
                ? `${treatment.treatment_owner.firstName || ''} ${treatment.treatment_owner.lastName || ''}`.trim()
                : undefined,
            status: treatment.status,
            priority: treatment.priority,
            start_date: toISOString(treatment.start_date),
            target_completion_date: toISOString(treatment.target_completion_date),
            actual_completion_date: toISOString(treatment.actual_completion_date),
            estimated_cost: treatment.estimated_cost,
            actual_cost: treatment.actual_cost,
            expected_risk_reduction: treatment.expected_risk_reduction,
            residual_likelihood: treatment.residual_likelihood,
            residual_impact: treatment.residual_impact,
            residual_risk_score: treatment.residual_risk_score,
            progress_percentage: treatment.progress_percentage,
            progress_notes: treatment.progress_notes,
            implementation_notes: treatment.implementation_notes,
            linked_control_ids: treatment.linked_control_ids,
            tasks: tasks.map(t => this.toTaskResponseDto(t)),
            total_tasks: tasks.length,
            completed_tasks: completedTasks,
            due_status: dueStatus,
            created_at: toISOString(treatment.created_at),
            updated_at: toISOString(treatment.updated_at),
        };
    }
    toTaskResponseDto(task) {
        const toISOString = (date) => {
            if (!date)
                return undefined;
            if (typeof date === 'string')
                return date;
            if (date instanceof Date)
                return date.toISOString();
            if (typeof date.toISOString === 'function')
                return date.toISOString();
            return undefined;
        };
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            assignee_id: task.assignee_id,
            assignee_name: task.assignee
                ? `${task.assignee.firstName || ''} ${task.assignee.lastName || ''}`.trim()
                : undefined,
            status: task.status,
            due_date: toISOString(task.due_date),
            completed_date: toISOString(task.completed_date),
            display_order: task.display_order,
        };
    }
};
exports.RiskTreatmentService = RiskTreatmentService;
exports.RiskTreatmentService = RiskTreatmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_treatment_entity_1.RiskTreatment)),
    __param(1, (0, typeorm_1.InjectRepository)(treatment_task_entity_1.TreatmentTask)),
    __param(2, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RiskTreatmentService);
//# sourceMappingURL=risk-treatment.service.js.map