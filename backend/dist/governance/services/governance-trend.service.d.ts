import { Repository } from 'typeorm';
import { GovernanceDashboardService } from './governance-dashboard.service';
import { GovernanceMetricSnapshot } from '../metrics/entities/governance-metric-snapshot.entity';
import { GovernanceTrendResponseDto } from '../dto/governance-trend.dto';
export declare class GovernanceTrendService {
    private readonly snapshotRepository;
    private readonly dashboardService;
    private readonly logger;
    constructor(snapshotRepository: Repository<GovernanceMetricSnapshot>, dashboardService: GovernanceDashboardService);
    getTrend(rangeDays?: number): Promise<GovernanceTrendResponseDto>;
    ensureSnapshotForDate(date: Date): Promise<void>;
    private fillMissingSnapshots;
    private buildForecast;
    private calculateTrendCoefficients;
    private toTrendPoint;
    private getUtcStartOfDay;
    private formatDate;
    private addDays;
    private clamp;
}
