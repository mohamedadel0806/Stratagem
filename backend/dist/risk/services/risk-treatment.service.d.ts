import { Repository } from 'typeorm';
import { RiskTreatment, TreatmentStatus, TreatmentPriority } from '../entities/risk-treatment.entity';
import { TreatmentTask } from '../entities/treatment-task.entity';
import { Risk } from '../entities/risk.entity';
import { CreateRiskTreatmentDto } from '../dto/treatment/create-risk-treatment.dto';
import { UpdateRiskTreatmentDto } from '../dto/treatment/update-risk-treatment.dto';
import { RiskTreatmentResponseDto, TreatmentTaskResponseDto } from '../dto/treatment/risk-treatment-response.dto';
export declare class RiskTreatmentService {
    private treatmentRepository;
    private taskRepository;
    private riskRepository;
    constructor(treatmentRepository: Repository<RiskTreatment>, taskRepository: Repository<TreatmentTask>, riskRepository: Repository<Risk>);
    findAll(filters?: {
        status?: TreatmentStatus;
        priority?: TreatmentPriority;
        ownerId?: string;
        riskId?: string;
    }): Promise<RiskTreatmentResponseDto[]>;
    findByRiskId(riskId: string): Promise<RiskTreatmentResponseDto[]>;
    findOne(id: string): Promise<RiskTreatmentResponseDto>;
    create(createDto: CreateRiskTreatmentDto, userId?: string): Promise<RiskTreatmentResponseDto>;
    update(id: string, updateDto: UpdateRiskTreatmentDto, userId?: string): Promise<RiskTreatmentResponseDto>;
    updateProgress(id: string, progress: number, notes?: string, userId?: string): Promise<RiskTreatmentResponseDto>;
    remove(id: string): Promise<void>;
    addTask(treatmentId: string, taskData: {
        title: string;
        description?: string;
        assignee_id?: string;
        due_date?: string;
    }): Promise<TreatmentTaskResponseDto>;
    updateTask(taskId: string, taskData: {
        title?: string;
        description?: string;
        assignee_id?: string;
        status?: string;
        due_date?: string;
    }): Promise<TreatmentTaskResponseDto>;
    removeTask(taskId: string): Promise<void>;
    getOverdueTreatments(): Promise<RiskTreatmentResponseDto[]>;
    getTreatmentsDueSoon(days?: number): Promise<RiskTreatmentResponseDto[]>;
    getTreatmentSummary(): Promise<{
        total: number;
        by_status: Record<string, number>;
        by_priority: Record<string, number>;
        overdue: number;
        completion_rate: number;
    }>;
    private toResponseDto;
    private toTaskResponseDto;
}
