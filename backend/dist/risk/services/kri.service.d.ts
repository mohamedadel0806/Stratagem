import { Repository } from 'typeorm';
import { KRI, KRIStatus } from '../entities/kri.entity';
import { KRIMeasurement } from '../entities/kri-measurement.entity';
import { KRIRiskLink } from '../entities/kri-risk-link.entity';
import { CreateKRIDto } from '../dto/kri/create-kri.dto';
import { UpdateKRIDto } from '../dto/kri/update-kri.dto';
import { CreateKRIMeasurementDto } from '../dto/kri/create-kri-measurement.dto';
import { KRIResponseDto, KRIMeasurementResponseDto } from '../dto/kri/kri-response.dto';
export declare class KRIService {
    private kriRepository;
    private measurementRepository;
    private linkRepository;
    constructor(kriRepository: Repository<KRI>, measurementRepository: Repository<KRIMeasurement>, linkRepository: Repository<KRIRiskLink>);
    findAll(filters?: {
        categoryId?: string;
        status?: KRIStatus;
        ownerId?: string;
        isActive?: boolean;
    }): Promise<KRIResponseDto[]>;
    findOne(id: string): Promise<KRIResponseDto>;
    create(createDto: CreateKRIDto, userId?: string): Promise<KRIResponseDto>;
    update(id: string, updateDto: UpdateKRIDto, userId?: string): Promise<KRIResponseDto>;
    remove(id: string): Promise<void>;
    addMeasurement(createDto: CreateKRIMeasurementDto, userId?: string): Promise<KRIMeasurementResponseDto>;
    getMeasurementHistory(kriId: string, limit?: number): Promise<KRIMeasurementResponseDto[]>;
    linkToRisk(kriId: string, riskId: string, relationshipType?: string, notes?: string, userId?: string): Promise<void>;
    unlinkFromRisk(kriId: string, riskId: string): Promise<void>;
    getLinkedRisks(kriId: string): Promise<any[]>;
    getKRIsForRisk(riskId: string): Promise<KRIResponseDto[]>;
    getKRIStatusSummary(): Promise<{
        total: number;
        by_status: Record<string, number>;
        by_trend: Record<string, number>;
        overdue_measurements: number;
    }>;
    getKRIsRequiringAttention(): Promise<KRIResponseDto[]>;
    private calculateNextMeasurementDate;
    private toResponseDto;
    private toISOString;
    private toMeasurementResponseDto;
}
