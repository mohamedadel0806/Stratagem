import { Repository } from 'typeorm';
import { GovernanceTrendService } from './governance-trend.service';
import { Policy } from '../policies/entities/policy.entity';
import { NotificationService } from '../../common/services/notification.service';
export declare class GovernanceScheduleService {
    private readonly trendService;
    private policyRepository;
    private notificationService;
    private readonly logger;
    constructor(trendService: GovernanceTrendService, policyRepository: Repository<Policy>, notificationService: NotificationService);
    captureGovernanceSnapshot(): Promise<void>;
    checkPolicyReviewReminders(): Promise<void>;
}
