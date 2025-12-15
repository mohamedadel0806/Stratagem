import { AssetType, RelationshipType } from '../entities/asset-dependency.entity';
export declare class AssetDependencyResponseDto {
    id: string;
    sourceAssetType: AssetType;
    sourceAssetId: string;
    sourceAssetName: string;
    sourceAssetIdentifier: string;
    targetAssetType: AssetType;
    targetAssetId: string;
    targetAssetName: string;
    targetAssetIdentifier: string;
    relationshipType: RelationshipType;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
