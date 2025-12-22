import { Repository } from 'typeorm';
import { GovernanceTrendService } from './governance-trend.service';
import { Policy } from '../policies/entities/policy.entity';
import { Influencer } from '../influencers/entities/influencer.entity';
import { SOP } from '../sops/entities/sop.entity';
import { Assessment } from '../assessments/entities/assessment.entity';
import { NotificationService } from '../../common/services/notification.service';
import { DashboardEmailService } from './dashboard-email.service';
export declare class GovernanceScheduleService {
    private readonly trendService;
    private policyRepository;
    private influencerRepository;
    private sopRepository;
    private assessmentRepository;
    private notificationService;
    private dashboardEmailService;
    private readonly logger;
    constructor(trendService: GovernanceTrendService, policyRepository: Repository<Policy>, influencerRepository: Repository<Influencer>, sopRepository: Repository<SOP>, assessmentRepository: Repository<Assessment>, notificationService: NotificationService, dashboardEmailService: DashboardEmailService);
    captureGovernanceSnapshot(): Promise<void>;
    checkPolicyReviewReminders(): Promise<void>;
    checkInfluencerReviewReminders(): Promise<void>;
    checkSOPReviewReminders(): Promise<void>;
    checkAssessmentReminders(): Promise<void>;
    sendScheduledDashboardEmails(): Promise<void>;
}
