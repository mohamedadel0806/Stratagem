import { CriticalityLevel } from '../entities/physical-asset.entity';
export declare class BulkUpdateDto {
    assetIds: string[];
    ownerId?: string;
    criticalityLevel?: CriticalityLevel;
    complianceTags?: string[];
    businessUnit?: string;
    department?: string;
}
export declare class BulkUpdateResponseDto {
    successful: number;
    failed: number;
    errors: Array<{
        assetId: string;
        error: string;
    }>;
}
