import { Repository } from 'typeorm';
import { ControlObjective } from './entities/control-objective.entity';
import { CreateControlObjectiveDto } from './dto/create-control-objective.dto';
import { Policy } from '../policies/entities/policy.entity';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { NotificationService } from '../../common/services/notification.service';
export declare class ControlObjectivesService {
    private controlObjectiveRepository;
    private policyRepository;
    private unifiedControlRepository;
    private notificationService?;
    private readonly logger;
    constructor(controlObjectiveRepository: Repository<ControlObjective>, policyRepository: Repository<Policy>, unifiedControlRepository: Repository<UnifiedControl>, notificationService?: NotificationService);
    create(createDto: CreateControlObjectiveDto, userId: string): Promise<ControlObjective>;
    findAll(policyId?: string): Promise<ControlObjective[]>;
    findOne(id: string): Promise<ControlObjective>;
    update(id: string, updateDto: Partial<CreateControlObjectiveDto>, userId: string): Promise<ControlObjective>;
    remove(id: string): Promise<void>;
    linkUnifiedControls(id: string, controlIds: string[]): Promise<ControlObjective>;
    unlinkUnifiedControls(id: string, controlIds: string[]): Promise<ControlObjective>;
    getUnifiedControls(id: string): Promise<UnifiedControl[]>;
}
