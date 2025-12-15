import { Response } from 'express';
import { GovernanceReportingService } from '../services/governance-reporting.service';
import { GapAnalysisService } from '../services/gap-analysis.service';
import { ReportQueryDto } from '../dto/report-query.dto';
import { GapAnalysisQueryDto, GapAnalysisDto } from '../dto/gap-analysis.dto';
export declare class GovernanceReportingController {
    private readonly reportingService;
    private readonly gapAnalysisService;
    constructor(reportingService: GovernanceReportingService, gapAnalysisService: GapAnalysisService);
    exportReport(query: ReportQueryDto, res: Response): Promise<void>;
    getPolicyComplianceReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getInfluencerReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getControlImplementationReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getAssessmentReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getFindingsReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getControlStatusReport(query: Partial<ReportQueryDto>, res: Response): Promise<void>;
    getGapAnalysis(query: GapAnalysisQueryDto): Promise<GapAnalysisDto>;
}
