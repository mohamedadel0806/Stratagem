import { Repository, EntityManager } from 'typeorm';
import { Influencer } from '../influencers/entities/influencer.entity';
import { Policy } from '../policies/entities/policy.entity';
import { PolicyAssignment } from '../policies/entities/policy-assignment.entity';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { Assessment } from '../assessments/entities/assessment.entity';
import { Finding } from '../findings/entities/finding.entity';
import { ReportQueryDto } from '../dto/report-query.dto';
export declare class GovernanceReportingService {
    private influencerRepository;
    private policyRepository;
    private assignmentRepository;
    private unifiedControlRepository;
    private assessmentRepository;
    private findingRepository;
    private entityManager;
    constructor(influencerRepository: Repository<Influencer>, policyRepository: Repository<Policy>, assignmentRepository: Repository<PolicyAssignment>, unifiedControlRepository: Repository<UnifiedControl>, assessmentRepository: Repository<Assessment>, findingRepository: Repository<Finding>, entityManager: EntityManager);
    generateReport(query: ReportQueryDto): Promise<{
        data: any;
        filename: string;
        contentType: string;
    }>;
    private generateExecutiveGovernanceReport;
    private getSummaryMetricsForReport;
    private getControlStatsForReport;
    private getPolicyStatsForReport;
    private getFindingStatsForReport;
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
