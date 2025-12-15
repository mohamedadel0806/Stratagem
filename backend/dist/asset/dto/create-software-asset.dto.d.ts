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
export declare class KnownVulnerabilityDto {
    cve_id: string;
    severity: string;
    description: string;
    patch_available: boolean;
}
export declare class CreateSoftwareAssetDto {
    uniqueIdentifier?: string;
    softwareName: string;
    softwareType?: string;
    versionNumber?: string;
    patchLevel?: string;
    businessPurpose?: string;
    ownerId?: string;
    businessUnitId?: string;
    vendorName?: string;
    vendorContact?: VendorContactDto;
    licenseType?: string;
    licenseCount?: number;
    licenseKey?: string;
    licenseExpiry?: string;
    installationCount?: number;
    securityTestResults?: SecurityTestResultsDto;
    lastSecurityTestDate?: string;
    knownVulnerabilities?: KnownVulnerabilityDto[];
    supportEndDate?: string;
}
