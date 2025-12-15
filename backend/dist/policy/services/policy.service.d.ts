import { Repository } from 'typeorm';
import { Policy, PolicyStatus } from '../entities/policy.entity';
import { PolicyResponseDto } from '../dto/policy-response.dto';
import { CreatePolicyDto } from '../dto/create-policy.dto';
import { UpdatePolicyDto } from '../dto/update-policy.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { PolicyQueryDto } from '../dto/policy-query.dto';
export declare class PolicyService {
    private policyRepository;
    private workflowService;
    constructor(policyRepository: Repository<Policy>, workflowService: WorkflowService);
    findAll(query?: PolicyQueryDto): Promise<{
        data: PolicyResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<PolicyResponseDto>;
    create(createPolicyDto: CreatePolicyDto, userId?: string): Promise<PolicyResponseDto>;
    update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<PolicyResponseDto>;
    uploadDocument(id: string, file: any): Promise<PolicyResponseDto>;
    remove(id: string): Promise<void>;
    bulkUpdateStatus(ids: string[], status: PolicyStatus): Promise<{
        updated: number;
        policies: PolicyResponseDto[];
    }>;
    private toResponseDto;
}
