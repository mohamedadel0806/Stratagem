import { AssetType, RelationshipType } from '../entities/asset-dependency.entity';
export declare class CreateAssetDependencyDto {
    targetAssetType: AssetType;
    targetAssetId: string;
    relationshipType: RelationshipType;
    description?: string;
}
