import { ComplianceService } from '../services/compliance.service';
import { ComplianceStatusResponseDto } from '../dto/compliance-status-response.dto';
import { CreateFrameworkDto } from '../dto/create-framework.dto';
import { UpdateFrameworkDto } from '../dto/update-framework.dto';
import { CreateRequirementDto } from '../dto/create-requirement.dto';
import { UpdateRequirementDto } from '../dto/update-requirement.dto';
import { BulkUpdateRequirementDto } from '../dto/bulk-update-requirement.dto';
import { FrameworkResponseDto } from '../dto/framework-response.dto';
import { RequirementResponseDto } from '../dto/requirement-response.dto';
import { BulkUploadResponseDto } from '../dto/bulk-upload-response.dto';
import { RequirementQueryDto } from '../dto/requirement-query.dto';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    getStatus(): Promise<ComplianceStatusResponseDto>;
    getFrameworks(): Promise<FrameworkResponseDto[]>;
    getFramework(id: string): Promise<FrameworkResponseDto>;
    createFramework(createDto: CreateFrameworkDto): Promise<FrameworkResponseDto>;
    updateFramework(id: string, updateDto: UpdateFrameworkDto): Promise<FrameworkResponseDto>;
    deleteFramework(id: string): Promise<{
        message: string;
    }>;
    getRequirements(query: RequirementQueryDto): Promise<{
        data: RequirementResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getRequirement(id: string): Promise<RequirementResponseDto>;
    createRequirement(createDto: CreateRequirementDto): Promise<RequirementResponseDto>;
    updateRequirement(id: string, updateDto: UpdateRequirementDto): Promise<RequirementResponseDto>;
    deleteRequirement(id: string): Promise<{
        message: string;
    }>;
    bulkUpdateRequirementStatus(bulkUpdateDto: BulkUpdateRequirementDto): Promise<{
        updated: number;
        requirements: RequirementResponseDto[];
    }>;
    uploadRequirements(frameworkId: string, file: any): Promise<BulkUploadResponseDto>;
}
