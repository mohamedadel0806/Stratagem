import { User } from '../../users/entities/user.entity';
import { BusinessUnit } from '../../common/entities/business-unit.entity';
export declare class SoftwareAsset {
    id: string;
    uniqueIdentifier: string;
    softwareName: string;
    softwareType: string;
    versionNumber: string;
    patchLevel: string;
    businessPurpose: string;
    ownerId: string;
    owner: User;
    businessUnitId: string;
    businessUnit: BusinessUnit;
    vendorName: string;
    vendorContact: {
        name: string;
        email: string;
        phone: string;
    };
    licenseType: string;
    licenseCount: number;
    licenseKey: string;
    licenseExpiry: Date;
    installationCount: number;
    securityTestResults: any;
    lastSecurityTestDate: Date;
    knownVulnerabilities: any[];
    supportEndDate: Date;
    createdBy: string;
    createdByUser: User;
    createdAt: Date;
    updatedBy: string;
    updatedByUser: User;
    updatedAt: Date;
    deletedAt: Date;
}
