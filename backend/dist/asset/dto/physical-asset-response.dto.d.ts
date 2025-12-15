import { CriticalityLevel, ConnectivityStatus, NetworkApprovalStatus } from '../entities/physical-asset.entity';
export declare class PhysicalAssetResponseDto {
    id: string;
    assetTypeId?: string;
    assetType?: {
        id: string;
        name: string;
        category: string;
    };
    assetDescription: string;
    manufacturer?: string;
    model?: string;
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
    uniqueIdentifier: string;
    physicalLocation?: string;
    criticalityLevel?: CriticalityLevel;
    macAddresses?: string[];
    ipAddresses?: string[];
    installedSoftware?: Array<{
        name: string;
        version: string;
        patch_level: string;
    }>;
    activePortsServices?: Array<{
        port: number;
        service: string;
        protocol: string;
    }>;
    networkApprovalStatus?: NetworkApprovalStatus;
    connectivityStatus?: ConnectivityStatus;
    lastConnectivityCheck?: Date;
    serialNumber?: string;
    assetTag?: string;
    purchaseDate?: Date;
    warrantyExpiry?: Date;
    complianceRequirements?: string[];
    securityTestResults?: {
        last_test_date: Date;
        findings: string;
        severity: string;
    };
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    riskCount?: number;
}
