import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, Between } from 'typeorm';
import { RiskTreatment, TreatmentStatus, TreatmentPriority } from '../entities/risk-treatment.entity';
import { TreatmentTask } from '../entities/treatment-task.entity';
import { Risk } from '../entities/risk.entity';
import { CreateRiskTreatmentDto } from '../dto/treatment/create-risk-treatment.dto';
import { UpdateRiskTreatmentDto } from '../dto/treatment/update-risk-treatment.dto';
import { RiskTreatmentResponseDto, TreatmentTaskResponseDto } from '../dto/treatment/risk-treatment-response.dto';

@Injectable()
export class RiskTreatmentService {
  constructor(
    @InjectRepository(RiskTreatment)
    private treatmentRepository: Repository<RiskTreatment>,
    @InjectRepository(TreatmentTask)
    private taskRepository: Repository<TreatmentTask>,
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
  ) {}

  async findAll(filters?: {
    status?: TreatmentStatus;
    priority?: TreatmentPriority;
    ownerId?: string;
    riskId?: string;
  }): Promise<RiskTreatmentResponseDto[]> {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.ownerId) where.treatment_owner_id = filters.ownerId;
    if (filters?.riskId) where.risk_id = filters.riskId;

    const treatments = await this.treatmentRepository.find({
      where,
      relations: ['treatment_owner', 'risk', 'tasks'],
      order: { target_completion_date: 'ASC', priority: 'ASC' },
    });

    return treatments.map(t => this.toResponseDto(t));
  }

  async findByRiskId(riskId: string): Promise<RiskTreatmentResponseDto[]> {
    const treatments = await this.treatmentRepository.find({
      where: { risk_id: riskId },
      relations: ['treatment_owner', 'tasks'],
      order: { created_at: 'DESC' },
    });

    return treatments.map(t => this.toResponseDto(t));
  }

  async findOne(id: string): Promise<RiskTreatmentResponseDto> {
    const treatment = await this.treatmentRepository.findOne({
      where: { id },
      relations: ['treatment_owner', 'risk', 'tasks', 'tasks.assignee'],
    });

    if (!treatment) {
      throw new NotFoundException(`Risk treatment with ID ${id} not found`);
    }

    return this.toResponseDto(treatment);
  }

  async create(createDto: CreateRiskTreatmentDto, userId?: string): Promise<RiskTreatmentResponseDto> {
    // Verify risk exists
    const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
    if (!risk) {
      throw new NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
    }

    const treatment = this.treatmentRepository.create({
      ...createDto,
      start_date: createDto.start_date ? new Date(createDto.start_date) : undefined,
      target_completion_date: createDto.target_completion_date ? new Date(createDto.target_completion_date) : undefined,
      created_by: userId,
    });

    const savedTreatment = await this.treatmentRepository.save(treatment);
    
    // Reload with relations
    const fullTreatment = await this.treatmentRepository.findOne({
      where: { id: savedTreatment.id },
      relations: ['treatment_owner', 'risk', 'tasks'],
    });

    return this.toResponseDto(fullTreatment);
  }

  async update(id: string, updateDto: UpdateRiskTreatmentDto, userId?: string): Promise<RiskTreatmentResponseDto> {
    const treatment = await this.treatmentRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!treatment) {
      throw new NotFoundException(`Risk treatment with ID ${id} not found`);
    }

    // Handle date conversions
    const updateData: any = { ...updateDto, updated_by: userId };
    if (updateDto.start_date) updateData.start_date = new Date(updateDto.start_date);
    if (updateDto.target_completion_date) updateData.target_completion_date = new Date(updateDto.target_completion_date);
    if (updateDto.actual_completion_date) updateData.actual_completion_date = new Date(updateDto.actual_completion_date);

    Object.assign(treatment, updateData);
    const updatedTreatment = await this.treatmentRepository.save(treatment);

    // Reload with relations
    const fullTreatment = await this.treatmentRepository.findOne({
      where: { id: updatedTreatment.id },
      relations: ['treatment_owner', 'risk', 'tasks'],
    });

    return this.toResponseDto(fullTreatment);
  }

  async updateProgress(id: string, progress: number, notes?: string, userId?: string): Promise<RiskTreatmentResponseDto> {
    const treatment = await this.treatmentRepository.findOne({ where: { id } });

    if (!treatment) {
      throw new NotFoundException(`Risk treatment with ID ${id} not found`);
    }

    treatment.progress_percentage = progress;
    if (notes) treatment.progress_notes = notes;
    treatment.updated_by = userId;

    // Auto-complete if 100%
    if (progress === 100 && treatment.status !== TreatmentStatus.COMPLETED) {
      treatment.status = TreatmentStatus.COMPLETED;
      treatment.actual_completion_date = new Date();
    }

    const updatedTreatment = await this.treatmentRepository.save(treatment);

    const fullTreatment = await this.treatmentRepository.findOne({
      where: { id: updatedTreatment.id },
      relations: ['treatment_owner', 'risk', 'tasks'],
    });

    return this.toResponseDto(fullTreatment);
  }

  async remove(id: string): Promise<void> {
    const treatment = await this.treatmentRepository.findOne({ where: { id } });

    if (!treatment) {
      throw new NotFoundException(`Risk treatment with ID ${id} not found`);
    }

    await this.treatmentRepository.softDelete(id);
  }

  // Task management
  async addTask(treatmentId: string, taskData: { title: string; description?: string; assignee_id?: string; due_date?: string }): Promise<TreatmentTaskResponseDto> {
    const treatment = await this.treatmentRepository.findOne({ where: { id: treatmentId } });

    if (!treatment) {
      throw new NotFoundException(`Risk treatment with ID ${treatmentId} not found`);
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
      display_order: (maxOrder?.max || 0) + 1,
    });

    const savedTask = await this.taskRepository.save(task);
    return this.toTaskResponseDto(savedTask);
  }

  async updateTask(taskId: string, taskData: { title?: string; description?: string; assignee_id?: string; status?: string; due_date?: string }): Promise<TreatmentTaskResponseDto> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException(`Treatment task with ID ${taskId} not found`);
    }

    Object.assign(task, taskData);
    if (taskData.due_date) task.due_date = new Date(taskData.due_date);
    if (taskData.status === 'completed') task.completed_date = new Date();

    const updatedTask = await this.taskRepository.save(task);
    return this.toTaskResponseDto(updatedTask);
  }

  async removeTask(taskId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException(`Treatment task with ID ${taskId} not found`);
    }

    await this.taskRepository.remove(task);
  }

  // Dashboard queries
  async getOverdueTreatments(): Promise<RiskTreatmentResponseDto[]> {
    const treatments = await this.treatmentRepository.find({
      where: {
        status: In([TreatmentStatus.PLANNED, TreatmentStatus.IN_PROGRESS]),
        target_completion_date: LessThan(new Date()),
      },
      relations: ['treatment_owner', 'risk'],
      order: { target_completion_date: 'ASC' },
    });

    return treatments.map(t => this.toResponseDto(t));
  }

  async getTreatmentsDueSoon(days = 7): Promise<RiskTreatmentResponseDto[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const treatments = await this.treatmentRepository.find({
      where: {
        status: In([TreatmentStatus.PLANNED, TreatmentStatus.IN_PROGRESS]),
        target_completion_date: Between(today, futureDate),
      },
      relations: ['treatment_owner', 'risk'],
      order: { target_completion_date: 'ASC' },
    });

    return treatments.map(t => this.toResponseDto(t));
  }

  async getTreatmentSummary(): Promise<{
    total: number;
    by_status: Record<string, number>;
    by_priority: Record<string, number>;
    overdue: number;
    completion_rate: number;
  }> {
    const treatments = await this.treatmentRepository.find();
    const today = new Date();

    const summary = {
      total: treatments.length,
      by_status: {} as Record<string, number>,
      by_priority: {} as Record<string, number>,
      overdue: 0,
      completion_rate: 0,
    };

    let completed = 0;

    for (const t of treatments) {
      // By status
      summary.by_status[t.status] = (summary.by_status[t.status] || 0) + 1;
      
      // By priority
      summary.by_priority[t.priority] = (summary.by_priority[t.priority] || 0) + 1;

      // Overdue check
      if (t.target_completion_date && t.target_completion_date < today && 
          t.status !== TreatmentStatus.COMPLETED && t.status !== TreatmentStatus.CANCELLED) {
        summary.overdue++;
      }

      if (t.status === TreatmentStatus.COMPLETED) {
        completed++;
      }
    }

    summary.completion_rate = treatments.length > 0 
      ? Math.round((completed / treatments.length) * 100) 
      : 0;

    return summary;
  }

  private toResponseDto(treatment: RiskTreatment): RiskTreatmentResponseDto {
    const today = new Date();
    let dueStatus: 'on_track' | 'due_soon' | 'overdue' | 'completed' = 'on_track';

    if (treatment.status === TreatmentStatus.COMPLETED) {
      dueStatus = 'completed';
    } else if (treatment.target_completion_date) {
      const dueDate = new Date(treatment.target_completion_date);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue < 0) {
        dueStatus = 'overdue';
      } else if (daysUntilDue <= 7) {
        dueStatus = 'due_soon';
      }
    }

    const tasks = treatment.tasks || [];
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    // Helper function to safely convert dates to ISO string
    const toISOString = (date: any): string | undefined => {
      if (!date) return undefined;
      if (typeof date === 'string') return date;
      if (date instanceof Date) return date.toISOString();
      if (typeof date.toISOString === 'function') return date.toISOString();
      return undefined;
    };

    return {
      id: treatment.id,
      treatment_id: treatment.treatment_id,
      risk_id: treatment.risk_id,
      risk_title: treatment.risk?.title,
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

  private toTaskResponseDto(task: TreatmentTask): TreatmentTaskResponseDto {
    // Helper function to safely convert dates to ISO string
    const toISOString = (date: any): string | undefined => {
      if (!date) return undefined;
      if (typeof date === 'string') return date;
      if (date instanceof Date) return date.toISOString();
      if (typeof date.toISOString === 'function') return date.toISOString();
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
}

