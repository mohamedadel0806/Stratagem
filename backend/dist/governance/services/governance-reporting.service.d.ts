import { Repository } from 'typeorm';
import { Influencer } from '../influencers/entities/influencer.entity';
import { Policy } from '../policies/entities/policy.entity';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { Assessment } from '../assessments/entities/assessment.entity';
import { Finding } from '../findings/entities/finding.entity';
import { ReportQueryDto } from '../dto/report-query.dto';
export declare class GovernanceReportingService {
    private influencerRepository;
    private policyRepository;
    private unifiedControlRepository;
    private assessmentRepository;
    private findingRepository;
    constructor(influencerRepository: Repository<Influencer>, policyRepository: Repository<Policy>, unifiedControlRepository: Repository<UnifiedControl>, assessmentRepository: Repository<Assessment>, findingRepository: Repository<Finding>);
    generateReport(query: ReportQueryDto): Promise<{
        data: any;
        filename: string;
        contentType: string;
    }>;
    private generatePolicyComplianceReport;
    private generateInfluencerReport;
    private generateControlImplementationReport;
    private generateAssessmentReport;
    private generateFindingsReport;
    private generateControlStatusReport;
    private exportToCsv;
    generateErrorCsv(errorMessage: string, reportType: string): {
        data: Buffer;
        filename: string;
        contentType: string;
    };
}
