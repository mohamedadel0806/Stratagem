import { DashboardService } from '../services/dashboard.service';
import { DashboardOverviewDto } from '../dto/dashboard-overview.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(): Promise<DashboardOverviewDto>;
}
