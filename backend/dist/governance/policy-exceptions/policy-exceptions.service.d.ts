import { Repository } from 'typeorm';
import { PolicyException } from './entities/policy-exception.entity';
import { CreatePolicyExceptionDto } from './dto/create-policy-exception.dto';
import { UpdatePolicyExceptionDto } from './dto/update-policy-exception.dto';
import { QueryPolicyExceptionDto } from './dto/query-policy-exception.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { NotificationService } from '../../common/services/notification.service';
export declare class PolicyExceptionsService {
    private exceptionRepository;
    private workflowService;
    private notificationService;
    private readonly logger;
    constructor(exceptionRepository: Repository<PolicyException>, workflowService: WorkflowService, notificationService: NotificationService);
    create(dto: CreatePolicyExceptionDto, userId: string): Promise<PolicyException>;
    findAll(query: QueryPolicyExceptionDto): Promise<{
        data: PolicyException[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<PolicyException>;
    update(id: string, dto: UpdatePolicyExceptionDto, userId: string): Promise<PolicyException>;
    delete(id: string): Promise<void>;
    approve(id: string, userId: string, conditions?: string): Promise<PolicyException>;
    reject(id: string, userId: string, reason: string): Promise<PolicyException>;
    private generateExceptionIdentifier;
}
