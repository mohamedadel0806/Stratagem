import { ComplianceScorecardService, ComplianceScorecardResponse } from '../services/compliance-scorecard.service';
export declare class ComplianceScorecardController {
    private readonly scorecardService;
    constructor(scorecardService: ComplianceScorecardService);
    getScorecard(frameworkIds?: string): Promise<ComplianceScorecardResponse>;
}
