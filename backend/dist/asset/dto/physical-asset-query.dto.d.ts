import { CriticalityLevel, ConnectivityStatus } from '../entities/physical-asset.entity';
export declare class PhysicalAssetQueryDto {
    search?: string;
    assetType?: string;
    criticalityLevel?: CriticalityLevel;
    connectivityStatus?: ConnectivityStatus;
    businessUnit?: string;
    ownerId?: string;
    hasDependencies?: boolean;
    page?: number;
    limit?: number;
}
