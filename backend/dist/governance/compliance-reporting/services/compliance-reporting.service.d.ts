import { Repository } from 'typeorm';
import { ComplianceReport } from '../entities/compliance-report.entity';
import { Policy } from '../../policies/entities/policy.entity';
import { UnifiedControl } from '../../unified-controls/entities/unified-control.entity';
import { User } from '../../../users/entities/user.entity';
import { ControlAssetMapping } from '../../unified-controls/entities/control-asset-mapping.entity';
import { CreateComplianceReportDto, ComplianceReportDto, ComplianceDashboardDto, ComplianceReportFilterDto } from '../dto/compliance-report.dto';
export declare class ComplianceReportingService {
    private readonly complianceReportRepository;
    private readonly policyRepository;
    private readonly controlRepository;
    private readonly assetMappingRepository;
    private readonly userRepository;
    private readonly logger;
    constructor(complianceReportRepository: Repository<ComplianceReport>, policyRepository: Repository<Policy>, controlRepository: Repository<UnifiedControl>, assetMappingRepository: Repository<ControlAssetMapping>, userRepository: Repository<User>);
    generateComplianceReport(dto: CreateComplianceReportDto, userId: string): Promise<ComplianceReport>;
    private calculatePolicyMetrics;
    private calculateControlMetrics;
    private calculateAssetMetrics;
    private calculateDepartmentBreakdown;
    private calculateTrendData;
    private calculateOverallScore;
    private getComplianceRating;
    private identifyGaps;
    private generateForecast;
    private generateExecutiveSummary;
    private generateKeyFindings;
    private generateRecommendations;
    getReport(reportId: string): Promise<ComplianceReportDto>;
    getReports(filter: ComplianceReportFilterDto): Promise<{
        data: ComplianceReportDto[];
        total: number;
    }>;
    getLatestReport(): Promise<ComplianceReportDto | null>;
    getComplianceDashboard(): Promise<ComplianceDashboardDto>;
    archiveReport(reportId: string): Promise<void>;
    private mapToDto;
}
