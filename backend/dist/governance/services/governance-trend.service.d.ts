import { Repository } from 'typeorm';
import { GovernanceDashboardService } from './governance-dashboard.service';
import { GovernanceMetricSnapshot } from '../metrics/entities/governance-metric-snapshot.entity';
import { ControlTest } from '../unified-controls/entities/control-test.entity';
import { GovernanceTrendResponseDto } from '../dto/governance-trend.dto';
export declare class GovernanceTrendService {
    private readonly snapshotRepository;
    private readonly testRepository;
    private readonly dashboardService;
    private readonly logger;
    constructor(snapshotRepository: Repository<GovernanceMetricSnapshot>, testRepository: Repository<ControlTest>, dashboardService: GovernanceDashboardService);
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
    getControlEffectivenessTrend(controlId?: string, rangeDays?: number): Promise<{
        date: any;
        score: number;
    }[]>;
}
