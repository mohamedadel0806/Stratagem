import { Response } from 'express';
import { GovernanceReportingService } from '../services/governance-reporting.service';
import { GapAnalysisService } from '../services/gap-analysis.service';
import { GovernanceDashboardService } from '../services/governance-dashboard.service';
import { ReportQueryDto } from '../dto/report-query.dto';
import { GapAnalysisQueryDto, GapAnalysisDto } from '../dto/gap-analysis.dto';
export declare class GovernanceReportingController {
    private readonly reportingService;
    private readonly gapAnalysisService;
    private readonly dashboardService;
    constructor(reportingService: GovernanceReportingService, gapAnalysisService: GapAnalysisService, dashboardService: GovernanceDashboardService);
    exportReport(query: ReportQueryDto, res: Response): Promise<void>;
    getPolicyComplianceReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getInfluencerReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getControlImplementationReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getAssessmentReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getFindingsReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getControlStatusReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getGapAnalysis(query: GapAnalysisQueryDto): Promise<GapAnalysisDto>;
    getPolicyComplianceStats(): Promise<{
        byPolicy: {
            id: string;
            title: string;
            totalAssignments: number;
            acknowledged: number;
            rate: number;
        }[];
        byDepartment: any;
    }>;
    getExecutiveSummary(): Promise<import("../dto/governance-dashboard.dto").GovernanceDashboardDto>;
}
