import { GovernanceDashboardService } from '../services/governance-dashboard.service';
import { GovernanceDashboardDto } from '../dto/governance-dashboard.dto';
import { GovernanceTrendService } from '../services/governance-trend.service';
import { GovernanceTrendResponseDto } from '../dto/governance-trend.dto';
export declare class GovernanceDashboardController {
    private readonly dashboardService;
    private readonly trendService;
    constructor(dashboardService: GovernanceDashboardService, trendService: GovernanceTrendService);
    getDashboard(): Promise<GovernanceDashboardDto>;
    getDashboardTrends(): Promise<GovernanceTrendResponseDto>;
}
