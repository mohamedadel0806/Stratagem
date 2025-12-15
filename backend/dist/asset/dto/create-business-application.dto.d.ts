import { CriticalityLevel } from '../entities/business-application.entity';
import { ClassificationLevel } from '../entities/information-asset.entity';
export declare class VendorContactDto {
    name: string;
    email: string;
    phone: string;
}
export declare class SecurityTestResultsDto {
    last_test_date: Date;
    findings: string;
    severity: string;
}
export declare class CreateBusinessApplicationDto {
    uniqueIdentifier?: string;
    applicationName: string;
    applicationType?: string;
    versionNumber?: string;
    patchLevel?: string;
    businessPurpose?: string;
    ownerId?: string;
    businessUnitId?: string;
    dataProcessed?: string[];
    dataClassification?: ClassificationLevel;
    vendorName?: string;
    vendorContact?: VendorContactDto;
    licenseType?: string;
    licenseCount?: number;
    licenseExpiry?: string;
    hostingType?: string;
    hostingLocation?: string;
    accessUrl?: string;
    securityTestResults?: SecurityTestResultsDto;
    lastSecurityTestDate?: string;
    authenticationMethod?: string;
    complianceRequirements?: string[];
    criticalityLevel?: CriticalityLevel;
}
