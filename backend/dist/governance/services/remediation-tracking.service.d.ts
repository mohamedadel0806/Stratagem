import { Repository } from 'typeorm';
import { RemediationTracker } from '../findings/entities/remediation-tracker.entity';
import { Finding } from '../findings/entities/finding.entity';
import { RemediationTrackerDto, RemediationDashboardDto, CreateRemediationTrackerDto, UpdateRemediationTrackerDto, CompleteRemediationDto } from '../dto/remediation-tracker.dto';
export declare class RemediationTrackingService {
    private readonly trackerRepository;
    private readonly findingRepository;
    private readonly logger;
    constructor(trackerRepository: Repository<RemediationTracker>, findingRepository: Repository<Finding>);
    getDashboard(): Promise<RemediationDashboardDto>;
    createTracker(findingId: string, data: CreateRemediationTrackerDto): Promise<RemediationTrackerDto>;
    updateTracker(trackerId: string, data: UpdateRemediationTrackerDto): Promise<RemediationTrackerDto>;
    completeRemediation(trackerId: string, data: CompleteRemediationDto): Promise<RemediationTrackerDto>;
    getTrackersByFinding(findingId: string): Promise<RemediationTrackerDto[]>;
    private updateFindingIfComplete;
    private toDto;
}
