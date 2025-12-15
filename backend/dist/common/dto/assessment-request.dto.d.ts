export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';
export declare class BulkAssessRequestDto {
    assetType: AssetType;
    assetIds: string[];
}
export declare class AssessAssetRequestDto {
    assetType: AssetType;
    assetId: string;
    requirementId?: string;
}
