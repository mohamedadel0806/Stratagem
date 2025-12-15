export declare enum AssetType {
    PHYSICAL = "physical",
    INFORMATION = "information",
    APPLICATION = "application",
    SOFTWARE = "software",
    SUPPLIER = "supplier",
    ALL = "all"
}
export declare class GlobalAssetSearchQueryDto {
    q?: string;
    type?: AssetType;
    page?: number;
    limit?: number;
    criticality?: string;
    businessUnit?: string;
}
export declare class GlobalAssetSearchResultDto {
    id: string;
    type: AssetType;
    name: string;
    identifier: string;
    criticality?: string;
    owner?: string;
    businessUnit?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GlobalAssetSearchResponseDto {
    data: GlobalAssetSearchResultDto[];
    total: number;
    page: number;
    limit: number;
}
