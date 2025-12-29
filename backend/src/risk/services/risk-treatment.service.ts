import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, Between } from 'typeorm';
import { RiskTreatment, TreatmentStatus, TreatmentPriority } from '../entities/risk-treatment.entity';
import { TreatmentTask } from '../entities/treatment-task.entity';
import { Risk } from '../entities/risk.entity';
import { CreateRiskTreatmentDto } from '../dto/treatment/create-risk-treatment.dto';
import { UpdateRiskTreatmentDto } from '../dto/treatment/update-risk-treatment.dto';
import { RiskTreatmentResponseDto, TreatmentTaskResponseDto } from '../dto/treatment/risk-treatment-response.dto';
import { TenantContextService } from '../../common/context/tenant-context.service';

@Injectable()
export class RiskTreatmentService {
  constructor(
    @InjectRepository(RiskTreatment)
    private treatmentRepository: Repository<RiskTreatment>,
    @InjectRepository(TreatmentTask)
    private taskRepository: Repository<TreatmentTask>,
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
    private tenantContextService: TenantContextService,
  ) { }

  async findAll(filters?: {
    status?: TreatmentStatus;
    priority?: TreatmentPriority;
    ownerId?: string;
    riskId?: string;
  }): Promise<RiskTreatmentResponseDto[]> {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.ownerId) where.treatmentOwnerId = filters.ownerId;
    if (filters?.riskId) where.riskId = filters.riskId;

    const treatments = await this.treatmentRepository.find({
      where,
      relations: ['treatmentOwner', 'risk', 'tasks'],
      order: { targetCompletionDate: 'ASC', priority: 'ASC' },
    });

    return treatments.map(t => this.toResponseDto(t));
  }

  async findByRiskId(riskId: string): Promise<RiskTreatmentResponseDto[]> {
    const treatments = await this.treatmentRepository.find({
      where: { riskId: riskId },
      relations: ['treatmentOwner', 'tasks'],
      order: { createdAt: 'DESC' },
    });

    return treatments.map(t => this.toResponseDto(t));
  }

  async findOne(id: string): Promise<RiskTreatmentResponseDto> {
    const treatment = await this.treatmentRepository.findOne({
      where: { id },
      relations: ['treatmentOwner', 'risk', 'tasks', 'tasks.assignee'],
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

    const { risk_id, start_date, target_completion_date, treatment_owner_id, ...rest } = createDto;

    const treatment = this.treatmentRepository.create({
      ...rest,
      tenantId: this.tenantContextService.getTenantId(),
      riskId: risk_id,
      startDate: start_date ? new Date(start_date) : undefined,
      targetCompletionDate: target_completion_date ? new Date(target_completion_date) : undefined,
      treatmentOwnerId: treatment_owner_id,
      createdBy: userId,
    });

    const savedTreatment = await this.treatmentRepository.save(treatment);

    // Reload with relations
    const fullTreatment = await this.treatmentRepository.findOne({
      where: { id: savedTreatment.id },
      relations: ['treatmentOwner', 'risk', 'tasks'],
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

    // Handle date conversions and mapping
    const { start_date, target_completion_date, actual_completion_date, treatment_owner_id, risk_id, ...rest } = updateDto as any;

    const updateData: any = { ...rest, updatedBy: userId };
    if (start_date) updateData.startDate = new Date(start_date);
    if (target_completion_date) updateData.targetCompletionDate = new Date(target_completion_date);
    if (actual_completion_date) updateData.actualCompletionDate = new Date(actual_completion_date);
    if (treatment_owner_id) updateData.treatmentOwnerId = treatment_owner_id;
    if (risk_id) updateData.riskId = risk_id;

    Object.assign(treatment, updateData);
    const updatedTreatment = await this.treatmentRepository.save(treatment);

    // Reload with relations
    const fullTreatment = await this.treatmentRepository.findOne({
      where: { id: updatedTreatment.id },
      relations: ['treatmentOwner', 'risk', 'tasks'],
    });

    return this.toResponseDto(fullTreatment);
  }

  async updateProgress(id: string, progress: number, notes?: string, userId?: string): Promise<RiskTreatmentResponseDto> {
    const treatment = await this.treatmentRepository.findOne({ where: { id } });

    if (!treatment) {
      throw new NotFoundException(`Risk treatment with ID ${id} not found`);
    }

    treatment.progressPercentage = progress;
    if (notes) treatment.progressNotes = notes;
    treatment.updatedBy = userId;

    // Auto-complete if 100%
    if (progress === 100 && treatment.status !== TreatmentStatus.COMPLETED) {
      treatment.status = TreatmentStatus.COMPLETED;
      treatment.actualCompletionDate = new Date();
    }

    const updatedTreatment = await this.treatmentRepository.save(treatment);

    const fullTreatment = await this.treatmentRepository.findOne({
      where: { id: updatedTreatment.id },
      relations: ['treatmentOwner', 'risk', 'tasks'],
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
      .where('task.treatmentId = :treatmentId', { treatmentId })
      .select('MAX(task.displayOrder)', 'max')
      .getRawOne();

    const task = this.taskRepository.create({
      treatmentId,
      tenantId: this.tenantContextService.getTenantId(),
      title: taskData.title,
      description: taskData.description,
      assigneeId: taskData.assignee_id,
      dueDate: taskData.due_date ? new Date(taskData.due_date) : undefined,
      displayOrder: (maxOrder?.max || 0) + 1,
    });

    const savedTask = await this.taskRepository.save(task);
    return this.toTaskResponseDto(savedTask);
  }

  async updateTask(taskId: string, taskData: { title?: string; description?: string; assignee_id?: string; status?: string; due_date?: string }): Promise<TreatmentTaskResponseDto> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException(`Treatment task with ID ${taskId} not found`);
    }

    const { assignee_id, due_date, ...rest } = taskData as any;
    const updateData: any = { ...rest };
    if (assignee_id) updateData.assigneeId = assignee_id;
    if (due_date) updateData.dueDate = new Date(due_date);
    if (taskData.status === 'completed') updateData.completedDate = new Date();

    Object.assign(task, updateData);
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
        targetCompletionDate: LessThan(new Date()),
      },
      relations: ['treatmentOwner', 'risk'],
      order: { targetCompletionDate: 'ASC' },
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
        targetCompletionDate: Between(today, futureDate),
      },
      relations: ['treatmentOwner', 'risk'],
      order: { targetCompletionDate: 'ASC' },
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
      if (t.targetCompletionDate && t.targetCompletionDate < today &&
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
    } else if (treatment.targetCompletionDate) {
      const dueDate = new Date(treatment.targetCompletionDate);
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
      treatment_id: treatment.treatmentCode,
      risk_id: treatment.riskId,
      risk_title: treatment.risk?.title,
      strategy: treatment.strategy,
      title: treatment.title,
      description: treatment.description,
      treatment_owner_id: treatment.treatmentOwnerId,
      treatment_owner_name: treatment.treatmentOwner
        ? `${treatment.treatmentOwner.firstName || ''} ${treatment.treatmentOwner.lastName || ''}`.trim()
        : undefined,
      status: treatment.status,
      priority: treatment.priority,
      start_date: toISOString(treatment.startDate),
      target_completion_date: toISOString(treatment.targetCompletionDate),
      actual_completion_date: toISOString(treatment.actualCompletionDate),
      estimated_cost: treatment.estimatedCost,
      actual_cost: treatment.actualCost,
      expected_risk_reduction: treatment.expectedRiskReduction,
      residual_likelihood: treatment.residualLikelihood,
      residual_impact: treatment.residualImpact,
      residual_risk_score: treatment.residualRiskScore,
      progress_percentage: treatment.progressPercentage,
      progress_notes: treatment.progressNotes,
      implementation_notes: treatment.implementation_notes,
      linked_control_ids: treatment.linkedControlIds,
      tasks: tasks.map(t => this.toTaskResponseDto(t)),
      total_tasks: tasks.length,
      completed_tasks: completedTasks,
      due_status: dueStatus,
      created_at: toISOString(treatment.createdAt),
      updated_at: toISOString(treatment.updatedAt),
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
      assignee_id: task.assigneeId,
      assignee_name: task.assignee
        ? `${task.assignee.firstName || ''} ${task.assignee.lastName || ''}`.trim()
        : undefined,
      status: task.status,
      due_date: toISOString(task.dueDate),
      completed_date: toISOString(task.completedDate),
      display_order: task.displayOrder,
    };
  }
}
