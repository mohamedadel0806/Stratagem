import { TestType, TestStatus, SeverityLevel } from '../entities/security-test-result.entity';
export declare class CreateSecurityTestResultDto {
    assetType: 'application' | 'software';
    assetId: string;
    testType: TestType;
    testDate: string;
    status?: TestStatus;
    testerName?: string;
    testerCompany?: string;
    findingsCritical?: number;
    findingsHigh?: number;
    findingsMedium?: number;
    findingsLow?: number;
    findingsInfo?: number;
    severity?: SeverityLevel;
    overallScore?: number;
    passed?: boolean;
    summary?: string;
    findings?: string;
    recommendations?: string;
    reportFileId?: string;
    reportUrl?: string;
    remediationDueDate?: string;
    retestRequired?: boolean;
    retestDate?: string;
}
