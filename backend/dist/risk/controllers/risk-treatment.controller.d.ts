import { RiskTreatmentService } from '../services/risk-treatment.service';
import { CreateRiskTreatmentDto } from '../dto/treatment/create-risk-treatment.dto';
import { UpdateRiskTreatmentDto } from '../dto/treatment/update-risk-treatment.dto';
import { TreatmentStatus, TreatmentPriority } from '../entities/risk-treatment.entity';
export declare class RiskTreatmentController {
    private readonly treatmentService;
    constructor(treatmentService: RiskTreatmentService);
    findAll(status?: TreatmentStatus, priority?: TreatmentPriority, ownerId?: string, riskId?: string): Promise<import("../dto/treatment/risk-treatment-response.dto").RiskTreatmentResponseDto[]>;
    getSummary(): Promise<{
        total: number;
        by_status: Record<string, number>;
        by_priority: Record<string, number>;
        overdue: number;
        completion_rate: number;
    }>;
    getOverdue(): Promise<import("../dto/treatment/risk-treatment-response.dto").RiskTreatmentResponseDto[]>;
    getDueSoon(days?: number): Promise<import("../dto/treatment/risk-treatment-response.dto").RiskTreatmentResponseDto[]>;
    findByRiskId(riskId: string): Promise<import("../dto/treatment/risk-treatment-response.dto").RiskTreatmentResponseDto[]>;
    findOne(id: string): Promise<import("../dto/treatment/risk-treatment-response.dto").RiskTreatmentResponseDto>;
    create(createDto: CreateRiskTreatmentDto, req: any): Promise<import("../dto/treatment/risk-treatment-response.dto").RiskTreatmentResponseDto>;
    update(id: string, updateDto: UpdateRiskTreatmentDto, req: any): Promise<import("../dto/treatment/risk-treatment-response.dto").RiskTreatmentResponseDto>;
    updateProgress(id: string, body: {
        progress: number;
        notes?: string;
    }, req: any): Promise<import("../dto/treatment/risk-treatment-response.dto").RiskTreatmentResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addTask(id: string, taskData: {
        title: string;
        description?: string;
        assignee_id?: string;
        due_date?: string;
    }): Promise<import("../dto/treatment/risk-treatment-response.dto").TreatmentTaskResponseDto>;
    updateTask(taskId: string, taskData: {
        title?: string;
        description?: string;
        assignee_id?: string;
        status?: string;
        due_date?: string;
    }): Promise<import("../dto/treatment/risk-treatment-response.dto").TreatmentTaskResponseDto>;
    removeTask(taskId: string): Promise<{
        message: string;
    }>;
}
