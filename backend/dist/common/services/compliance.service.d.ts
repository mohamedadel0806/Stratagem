import { Repository } from 'typeorm';
import { ComplianceFramework } from '../entities/compliance-framework.entity';
import { ComplianceRequirement, RequirementStatus } from '../entities/compliance-requirement.entity';
import { ComplianceStatusResponseDto } from '../dto/compliance-status-response.dto';
import { CreateFrameworkDto } from '../dto/create-framework.dto';
import { UpdateFrameworkDto } from '../dto/update-framework.dto';
import { CreateRequirementDto } from '../dto/create-requirement.dto';
import { UpdateRequirementDto } from '../dto/update-requirement.dto';
import { FrameworkResponseDto } from '../dto/framework-response.dto';
import { RequirementResponseDto } from '../dto/requirement-response.dto';
import { RequirementQueryDto } from '../dto/requirement-query.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
export declare class ComplianceService {
    private frameworksRepository;
    private requirementsRepository;
    private workflowService;
    constructor(frameworksRepository: Repository<ComplianceFramework>, requirementsRepository: Repository<ComplianceRequirement>, workflowService: WorkflowService);
    getStatus(organizationId?: string): Promise<ComplianceStatusResponseDto>;
    findAllFrameworks(): Promise<FrameworkResponseDto[]>;
    findFrameworkById(id: string): Promise<FrameworkResponseDto>;
    createFramework(createDto: CreateFrameworkDto): Promise<FrameworkResponseDto>;
    updateFramework(id: string, updateDto: UpdateFrameworkDto): Promise<FrameworkResponseDto>;
    deleteFramework(id: string): Promise<void>;
    findAllRequirements(query?: RequirementQueryDto): Promise<{
        data: RequirementResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findRequirementById(id: string): Promise<RequirementResponseDto>;
    createRequirement(createDto: CreateRequirementDto): Promise<RequirementResponseDto>;
    updateRequirement(id: string, updateDto: UpdateRequirementDto): Promise<RequirementResponseDto>;
    deleteRequirement(id: string): Promise<void>;
    bulkUpdateRequirementStatus(ids: string[], status: RequirementStatus): Promise<{
        updated: number;
        requirements: RequirementResponseDto[];
    }>;
    private toFrameworkDto;
    bulkCreateRequirements(frameworkId: string, requirements: Array<{
        title: string;
        description?: string;
        requirementCode?: string;
        category?: string;
        complianceDeadline?: string;
        applicability?: string;
        status?: RequirementStatus;
    }>, clearExisting?: boolean): Promise<{
        created: number;
        errors: string[];
        deleted: number;
    }>;
    private toRequirementDto;
}
