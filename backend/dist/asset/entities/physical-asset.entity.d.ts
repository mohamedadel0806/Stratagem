import { User } from '../../users/entities/user.entity';
import { AssetType } from './asset-type.entity';
import { BusinessUnit } from '../../common/entities/business-unit.entity';
export declare enum CriticalityLevel {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare enum ConnectivityStatus {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    UNKNOWN = "unknown"
}
export declare enum NetworkApprovalStatus {
    APPROVED = "approved",
    PENDING = "pending",
    REJECTED = "rejected",
    NOT_REQUIRED = "not_required"
}
export declare class PhysicalAsset {
    id: string;
    assetTypeId: string;
    assetType: AssetType;
    assetDescription: string;
    manufacturer: string;
    model: string;
    businessPurpose: string;
    ownerId: string;
    owner: User;
    businessUnitId: string;
    businessUnit: BusinessUnit;
    uniqueIdentifier: string;
    physicalLocation: string;
    criticalityLevel: CriticalityLevel;
    macAddresses: string[];
    ipAddresses: string[];
    installedSoftware: Array<{
        name: string;
        version: string;
        patch_level: string;
    }>;
    activePortsServices: Array<{
        port: number;
        service: string;
        protocol: string;
    }>;
    networkApprovalStatus: NetworkApprovalStatus;
    connectivityStatus: ConnectivityStatus;
    lastConnectivityCheck: Date;
    serialNumber: string;
    assetTag: string;
    purchaseDate: Date;
    warrantyExpiry: Date;
    complianceRequirements: string[];
    securityTestResults: {
        last_test_date: Date;
        findings: string;
        severity: string;
    };
    createdBy: string;
    createdByUser: User;
    createdAt: Date;
    updatedBy: string;
    updatedByUser: User;
    updatedAt: Date;
    deletedAt: Date;
}
