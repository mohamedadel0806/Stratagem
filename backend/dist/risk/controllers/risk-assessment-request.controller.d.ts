import { RiskAssessmentRequestService } from '../services/risk-assessment-request.service';
import { CreateRiskAssessmentRequestDto } from '../dto/request/create-risk-assessment-request.dto';
import { UpdateRiskAssessmentRequestDto } from '../dto/request/update-risk-assessment-request.dto';
import { RequestStatus } from '../entities/risk-assessment-request.entity';
export declare class RiskAssessmentRequestController {
    private readonly requestService;
    constructor(requestService: RiskAssessmentRequestService);
    findAll(riskId?: string, requestedById?: string, requestedForId?: string, status?: RequestStatus, assessmentType?: string): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto[]>;
    findPending(req: any): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto[]>;
    findByRiskId(riskId: string): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto[]>;
    findOne(id: string): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto>;
    create(createDto: CreateRiskAssessmentRequestDto, req: any): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto>;
    update(id: string, updateDto: UpdateRiskAssessmentRequestDto, req: any): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto>;
    approve(id: string, req: any): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto>;
    reject(id: string, reason: string, req: any): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto>;
    cancel(id: string, req: any): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto>;
    markInProgress(id: string, req: any): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto>;
    complete(id: string, assessmentId: string, req: any): Promise<import("../dto/request/risk-assessment-request-response.dto").RiskAssessmentRequestResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
