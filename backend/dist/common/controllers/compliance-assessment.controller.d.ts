import { ComplianceAssessmentService } from '../services/compliance-assessment.service';
import { AssessmentResultDto, AssetComplianceStatusDto, ComplianceGapDto, BulkAssessmentResultDto, AssetComplianceListResponseDto } from '../dto/assessment-response.dto';
import { BulkAssessRequestDto } from '../dto/assessment-request.dto';
import { CreateValidationRuleDto, UpdateValidationRuleDto, ValidationRuleResponseDto } from '../dto/validation-rule.dto';
import { User } from '../../users/entities/user.entity';
import { AssetType, ComplianceStatus } from '../entities/asset-requirement-mapping.entity';
export declare class ComplianceAssessmentController {
    private readonly assessmentService;
    constructor(assessmentService: ComplianceAssessmentService);
    assessAssetRequirement(assetType: AssetType, assetId: string, requirementId: string, user: User): Promise<AssessmentResultDto>;
    assessAsset(assetType: AssetType, assetId: string, user: User): Promise<AssessmentResultDto[]>;
    getAssetComplianceStatus(assetType: AssetType, assetId: string): Promise<AssetComplianceStatusDto>;
    getComplianceGaps(assetType: AssetType, assetId: string): Promise<ComplianceGapDto[]>;
    getAssetComplianceList(assetType?: AssetType, complianceStatus?: ComplianceStatus, businessUnit?: string, criticality?: string, searchQuery?: string, page?: number, pageSize?: number): Promise<AssetComplianceListResponseDto>;
    bulkAssess(dto: BulkAssessRequestDto, user: User): Promise<BulkAssessmentResultDto>;
    getAssessmentHistory(assetType?: AssetType, assetId?: string, requirementId?: string, limit?: number, offset?: number): Promise<{
        message: string;
    }>;
    createValidationRule(createDto: CreateValidationRuleDto, user: User): Promise<ValidationRuleResponseDto>;
    findAllValidationRules(requirementId?: string, assetType?: AssetType): Promise<ValidationRuleResponseDto[]>;
    findValidationRuleById(id: string): Promise<ValidationRuleResponseDto>;
    updateValidationRule(id: string, updateDto: UpdateValidationRuleDto): Promise<ValidationRuleResponseDto>;
    deleteValidationRule(id: string): Promise<{
        message: string;
    }>;
}
