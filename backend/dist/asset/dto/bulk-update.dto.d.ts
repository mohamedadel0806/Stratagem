import { CriticalityLevel } from '../entities/physical-asset.entity';
export declare class BulkUpdateDto {
    assetIds: string[];
    ownerId?: string;
    criticalityLevel?: CriticalityLevel;
    complianceTags?: string[];
    businessUnit?: string;
    department?: string;
    versionNumber?: string;
    patchLevel?: string;
    rollbackOnError?: boolean;
}
export declare class BulkUpdateResponseDto {
    successful: number;
    failed: number;
    errors: Array<{
        assetId: string;
        error: string;
    }>;
    rolledBack?: boolean;
}
