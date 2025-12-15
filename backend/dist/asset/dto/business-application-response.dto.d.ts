import { CriticalityLevel } from '../entities/business-application.entity';
import { ClassificationLevel } from '../entities/information-asset.entity';
export declare class BusinessApplicationResponseDto {
    id: string;
    uniqueIdentifier: string;
    applicationName: string;
    applicationType?: string;
    versionNumber?: string;
    patchLevel?: string;
    businessPurpose?: string;
    ownerId?: string;
    owner?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    businessUnitId?: string;
    businessUnit?: {
        id: string;
        name: string;
        code?: string;
    };
    dataProcessed?: string[];
    dataClassification?: ClassificationLevel;
    vendorName?: string;
    vendorContact?: {
        name: string;
        email: string;
        phone: string;
    };
    licenseType?: string;
    licenseCount?: number;
    licenseExpiry?: Date;
    hostingType?: string;
    hostingLocation?: string;
    accessUrl?: string;
    securityTestResults?: {
        last_test_date: Date;
        findings: string;
        severity: string;
    };
    lastSecurityTestDate?: Date;
    authenticationMethod?: string;
    complianceRequirements?: string[];
    criticalityLevel?: CriticalityLevel;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    riskCount?: number;
}
