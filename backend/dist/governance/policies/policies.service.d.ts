import { Repository } from 'typeorm';
import { Policy } from './entities/policy.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyQueryDto } from './dto/policy-query.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { NotificationService } from '../../common/services/notification.service';
export declare class PoliciesService {
    private policyRepository;
    private workflowService?;
    private notificationService?;
    private readonly logger;
    constructor(policyRepository: Repository<Policy>, workflowService?: WorkflowService, notificationService?: NotificationService);
    create(createPolicyDto: CreatePolicyDto, userId: string): Promise<Policy>;
    findAll(queryDto: PolicyQueryDto): Promise<{
        data: Policy[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Policy>;
    update(id: string, updatePolicyDto: UpdatePolicyDto, userId: string): Promise<Policy>;
    remove(id: string): Promise<void>;
    findVersions(id: string): Promise<Policy[]>;
}
