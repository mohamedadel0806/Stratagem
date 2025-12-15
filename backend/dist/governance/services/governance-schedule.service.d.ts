import { GovernanceTrendService } from './governance-trend.service';
export declare class GovernanceScheduleService {
    private readonly trendService;
    private readonly logger;
    constructor(trendService: GovernanceTrendService);
    captureGovernanceSnapshot(): Promise<void>;
}
