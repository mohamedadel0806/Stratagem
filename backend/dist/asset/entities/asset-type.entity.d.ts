export declare enum AssetCategory {
    PHYSICAL = "physical",
    INFORMATION = "information",
    APPLICATION = "application",
    SOFTWARE = "software",
    SUPPLIER = "supplier"
}
export declare class AssetType {
    id: string;
    category: AssetCategory;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
