import { User } from '../../users/entities/user.entity';
import { BusinessUnit } from '../../common/entities/business-unit.entity';
import { ClassificationLevel } from './information-asset.entity';
export declare enum CriticalityLevel {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare class BusinessApplication {
    id: string;
    uniqueIdentifier: string;
    applicationName: string;
    applicationType: string;
    versionNumber: string;
    patchLevel: string;
    businessPurpose: string;
    ownerId: string;
    owner: User;
    businessUnitId: string;
    businessUnit: BusinessUnit;
    dataProcessed: string[];
    dataClassification: ClassificationLevel;
    vendorName: string;
    vendorContact: {
        name: string;
        email: string;
        phone: string;
    };
    licenseType: string;
    licenseCount: number;
    licenseExpiry: Date;
    hostingType: string;
    hostingLocation: string;
    accessUrl: string;
    securityTestResults: any;
    lastSecurityTestDate: Date;
    authenticationMethod: string;
    complianceRequirements: string[];
    criticalityLevel: CriticalityLevel;
    createdBy: string;
    createdByUser: User;
    createdAt: Date;
    updatedBy: string;
    updatedByUser: User;
    updatedAt: Date;
    deletedAt: Date;
}
