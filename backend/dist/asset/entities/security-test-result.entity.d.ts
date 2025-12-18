import { BusinessApplication } from './business-application.entity';
import { SoftwareAsset } from './software-asset.entity';
import { User } from '../../users/entities/user.entity';
export declare enum TestType {
    PENETRATION_TEST = "penetration_test",
    VULNERABILITY_SCAN = "vulnerability_scan",
    CODE_REVIEW = "code_review",
    COMPLIANCE_AUDIT = "compliance_audit",
    SECURITY_ASSESSMENT = "security_assessment",
    OTHER = "other"
}
export declare enum TestStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum SeverityLevel {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFO = "info",
    PASSED = "passed"
}
export declare class SecurityTestResult {
    id: string;
    assetType: 'application' | 'software';
    assetId: string;
    application?: BusinessApplication;
    software?: SoftwareAsset;
    testType: TestType;
    testDate: Date;
    status: TestStatus;
    testerName?: string;
    testerCompany?: string;
    findingsCritical: number;
    findingsHigh: number;
    findingsMedium: number;
    findingsLow: number;
    findingsInfo: number;
    severity?: SeverityLevel;
    overallScore?: number;
    passed: boolean;
    summary?: string;
    findings?: string;
    recommendations?: string;
    reportFileId?: string;
    reportUrl?: string;
    remediationDueDate?: Date;
    remediationCompleted: boolean;
    retestRequired: boolean;
    retestDate?: Date;
    createdBy?: string;
    createdByUser?: User;
    createdAt: Date;
    updatedAt: Date;
}
