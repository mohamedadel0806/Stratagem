import { KRIService } from '../services/kri.service';
import { CreateKRIDto } from '../dto/kri/create-kri.dto';
import { UpdateKRIDto } from '../dto/kri/update-kri.dto';
import { CreateKRIMeasurementDto } from '../dto/kri/create-kri-measurement.dto';
import { KRIStatus } from '../entities/kri.entity';
export declare class KRIController {
    private readonly kriService;
    constructor(kriService: KRIService);
    findAll(categoryId?: string, status?: KRIStatus, ownerId?: string, isActive?: string): Promise<import("../dto/kri/kri-response.dto").KRIResponseDto[]>;
    getStatusSummary(): Promise<{
        total: number;
        by_status: Record<string, number>;
        by_trend: Record<string, number>;
        overdue_measurements: number;
    }>;
    getRequiringAttention(): Promise<import("../dto/kri/kri-response.dto").KRIResponseDto[]>;
    getKRIsForRisk(riskId: string): Promise<import("../dto/kri/kri-response.dto").KRIResponseDto[]>;
    findOne(id: string): Promise<import("../dto/kri/kri-response.dto").KRIResponseDto>;
    getMeasurements(id: string, limit?: number): Promise<import("../dto/kri/kri-response.dto").KRIMeasurementResponseDto[]>;
    getLinkedRisks(id: string): Promise<any[]>;
    create(createDto: CreateKRIDto, req: any): Promise<import("../dto/kri/kri-response.dto").KRIResponseDto>;
    update(id: string, updateDto: UpdateKRIDto, req: any): Promise<import("../dto/kri/kri-response.dto").KRIResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addMeasurement(id: string, measurementData: Omit<CreateKRIMeasurementDto, 'kri_id'>, req: any): Promise<import("../dto/kri/kri-response.dto").KRIMeasurementResponseDto>;
    linkToRisk(id: string, riskId: string, body: {
        relationship_type?: string;
        notes?: string;
    }, req: any): Promise<{
        message: string;
    }>;
    unlinkFromRisk(id: string, riskId: string): Promise<{
        message: string;
    }>;
}
