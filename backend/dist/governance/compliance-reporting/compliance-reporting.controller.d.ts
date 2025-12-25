import { ComplianceReportingService } from './services/compliance-reporting.service';
import { CreateComplianceReportDto, ComplianceReportDto, ComplianceDashboardDto, ComplianceReportFilterDto } from './dto/compliance-report.dto';
export declare class ComplianceReportingController {
    private readonly complianceReportingService;
    constructor(complianceReportingService: ComplianceReportingService);
    generateReport(createReportDto: CreateComplianceReportDto, req: any): Promise<ComplianceReportDto>;
    getReport(reportId: string): Promise<ComplianceReportDto>;
    getReports(filterDto: ComplianceReportFilterDto): Promise<{
        data: ComplianceReportDto[];
        total: number;
    }>;
    getLatestReport(): Promise<ComplianceReportDto>;
    getDashboard(): Promise<ComplianceDashboardDto>;
    archiveReport(reportId: string): Promise<void>;
}
