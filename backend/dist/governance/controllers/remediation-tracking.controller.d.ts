import { RemediationTrackingService } from '../services/remediation-tracking.service';
import { RemediationTrackerDto, RemediationDashboardDto, CreateRemediationTrackerDto, UpdateRemediationTrackerDto, CompleteRemediationDto } from '../dto/remediation-tracker.dto';
export declare class RemediationTrackingController {
    private readonly remediationService;
    constructor(remediationService: RemediationTrackingService);
    getDashboard(): Promise<RemediationDashboardDto>;
    createTracker(findingId: string, data: CreateRemediationTrackerDto): Promise<RemediationTrackerDto>;
    updateTracker(trackerId: string, data: UpdateRemediationTrackerDto): Promise<RemediationTrackerDto>;
    completeRemediation(trackerId: string, data: CompleteRemediationDto): Promise<RemediationTrackerDto>;
    getTrackersByFinding(findingId: string): Promise<RemediationTrackerDto[]>;
}
