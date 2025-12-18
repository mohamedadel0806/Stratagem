import { Repository } from 'typeorm';
import { SOP } from './entities/sop.entity';
import { SOPAssignment } from './entities/sop-assignment.entity';
import { CreateSOPDto } from './dto/create-sop.dto';
import { UpdateSOPDto } from './dto/update-sop.dto';
import { SOPQueryDto } from './dto/sop-query.dto';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { NotificationService } from '../../common/services/notification.service';
import { WorkflowExecution } from '../../workflow/entities/workflow-execution.entity';
import { User } from '../../users/entities/user.entity';
export declare class SOPsService {
    private sopRepository;
    private controlRepository;
    private workflowExecutionRepository;
    private assignmentRepository;
    private userRepository;
    private workflowService?;
    private notificationService?;
    private readonly logger;
    constructor(sopRepository: Repository<SOP>, controlRepository: Repository<UnifiedControl>, workflowExecutionRepository: Repository<WorkflowExecution>, assignmentRepository: Repository<SOPAssignment>, userRepository: Repository<User>, workflowService?: WorkflowService, notificationService?: NotificationService);
    create(createSOPDto: CreateSOPDto, userId: string): Promise<SOP>;
    findAll(queryDto: SOPQueryDto): Promise<{
        data: SOP[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<SOP>;
    update(id: string, updateSOPDto: UpdateSOPDto, userId: string): Promise<SOP>;
    publish(id: string, userId: string, assignToUserIds?: string[], assignToRoleIds?: string[]): Promise<SOP>;
    remove(id: string): Promise<void>;
    getAssignedSOPs(userId: string, queryDto?: SOPQueryDto): Promise<{
        data: SOP[];
        meta: any;
    }>;
    getPublicationStatistics(): Promise<{
        totalPublished: number;
        publishedThisMonth: number;
        publishedThisYear: number;
        assignmentsCount: number;
        acknowledgedCount: number;
        acknowledgmentRate: number;
    }>;
}
