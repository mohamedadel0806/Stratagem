export declare class SoftwareAssetResponseDto {
    id: string;
    uniqueIdentifier: string;
    softwareName: string;
    softwareType?: string;
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
    vendorName?: string;
    vendorContact?: {
        name: string;
        email: string;
        phone: string;
    };
    licenseType?: string;
    licenseCount?: number;
    licenseKey?: string;
    licenseExpiry?: Date;
    installationCount?: number;
    securityTestResults?: {
        last_test_date: Date;
        findings: string;
        severity: string;
    };
    lastSecurityTestDate?: Date;
    knownVulnerabilities?: Array<{
        cve_id: string;
        severity: string;
        description: string;
        patch_available: boolean;
    }>;
    supportEndDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    riskCount?: number;
}
