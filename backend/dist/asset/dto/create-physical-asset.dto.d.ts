import { CriticalityLevel, ConnectivityStatus, NetworkApprovalStatus } from '../entities/physical-asset.entity';
export declare class InstalledSoftwareDto {
    name: string;
    version: string;
    patch_level: string;
}
export declare class ActivePortsServicesDto {
    port: number;
    service: string;
    protocol: string;
}
export declare class SecurityTestResultsDto {
    last_test_date: Date;
    findings: string;
    severity: string;
}
export declare class CreatePhysicalAssetDto {
    assetTypeId?: string;
    assetDescription: string;
    manufacturer?: string;
    model?: string;
    businessPurpose?: string;
    ownerId?: string;
    businessUnitId?: string;
    uniqueIdentifier: string;
    physicalLocation?: string;
    criticalityLevel?: CriticalityLevel;
    macAddresses?: string[];
    ipAddresses?: string[];
    installedSoftware?: InstalledSoftwareDto[];
    activePortsServices?: ActivePortsServicesDto[];
    networkApprovalStatus?: NetworkApprovalStatus;
    connectivityStatus?: ConnectivityStatus;
    lastConnectivityCheck?: string;
    serialNumber?: string;
    assetTag?: string;
    purchaseDate?: string;
    warrantyExpiry?: string;
    complianceRequirements?: string[];
    securityTestResults?: SecurityTestResultsDto;
}
