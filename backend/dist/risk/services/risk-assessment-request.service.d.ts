import { Repository } from 'typeorm';
import { RiskAssessmentRequest, RequestStatus } from '../entities/risk-assessment-request.entity';
import { Risk } from '../entities/risk.entity';
import { RiskAssessment } from '../entities/risk-assessment.entity';
import { CreateRiskAssessmentRequestDto } from '../dto/request/create-risk-assessment-request.dto';
import { UpdateRiskAssessmentRequestDto } from '../dto/request/update-risk-assessment-request.dto';
import { RiskAssessmentRequestResponseDto } from '../dto/request/risk-assessment-request-response.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
export declare class RiskAssessmentRequestService {
    private requestRepository;
    private riskRepository;
    private assessmentRepository;
    private workflowService;
    constructor(requestRepository: Repository<RiskAssessmentRequest>, riskRepository: Repository<Risk>, assessmentRepository: Repository<RiskAssessment>, workflowService: WorkflowService);
    private generateRequestIdentifier;
    private toResponseDto;
    findAll(filters?: {
        riskId?: string;
        requestedById?: string;
        requestedForId?: string;
        status?: RequestStatus;
        assessmentType?: string;
    }): Promise<RiskAssessmentRequestResponseDto[]>;
    findOne(id: string): Promise<RiskAssessmentRequestResponseDto>;
    findByRiskId(riskId: string): Promise<RiskAssessmentRequestResponseDto[]>;
    findPendingForUser(userId: string): Promise<RiskAssessmentRequestResponseDto[]>;
    create(createDto: CreateRiskAssessmentRequestDto, userId: string, organizationId?: string): Promise<RiskAssessmentRequestResponseDto>;
    update(id: string, updateDto: UpdateRiskAssessmentRequestDto, userId: string): Promise<RiskAssessmentRequestResponseDto>;
    approve(id: string, userId: string): Promise<RiskAssessmentRequestResponseDto>;
    reject(id: string, userId: string, reason?: string): Promise<RiskAssessmentRequestResponseDto>;
    cancel(id: string, userId: string): Promise<RiskAssessmentRequestResponseDto>;
    markInProgress(id: string, userId: string): Promise<RiskAssessmentRequestResponseDto>;
    complete(id: string, assessmentId: string, userId: string): Promise<RiskAssessmentRequestResponseDto>;
    remove(id: string): Promise<void>;
    private validateStatusTransition;
}
