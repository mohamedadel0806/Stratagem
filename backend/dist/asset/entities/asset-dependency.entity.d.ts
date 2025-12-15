import { User } from '../../users/entities/user.entity';
export declare enum AssetType {
    PHYSICAL = "physical",
    INFORMATION = "information",
    APPLICATION = "application",
    SOFTWARE = "software",
    SUPPLIER = "supplier"
}
export declare enum RelationshipType {
    DEPENDS_ON = "depends_on",
    USES = "uses",
    CONTAINS = "contains",
    HOSTS = "hosts",
    PROCESSES = "processes",
    STORES = "stores",
    OTHER = "other"
}
export declare class AssetDependency {
    id: string;
    sourceAssetType: AssetType;
    sourceAssetId: string;
    targetAssetType: AssetType;
    targetAssetId: string;
    relationshipType: RelationshipType;
    description?: string;
    createdBy?: User;
    createdById?: string;
    createdAt: Date;
    updatedAt: Date;
}
