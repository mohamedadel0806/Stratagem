export declare class PolicyTreeNodeDto {
    id: string;
    title: string;
    policy_type: string;
    status: string;
    version: string;
    parent_policy_id?: string;
    children: PolicyTreeNodeDto[];
}
export declare class PolicyHierarchyDto {
    id: string;
    title: string;
    policy_type: string;
    status: string;
    version: string;
    parent?: PolicyTreeNodeDto;
    children: PolicyTreeNodeDto[];
    ancestors: Array<{
        id: string;
        title: string;
        level: number;
    }>;
    descendants: Array<{
        id: string;
        title: string;
        depth: number;
    }>;
    level: number;
    descendantCount: number;
    isRoot: boolean;
    hasChildren: boolean;
}
export declare class SetPolicyParentDto {
    parent_policy_id?: string | null;
    reason?: string;
}
export declare class PolicyHierarchyWithStatsDto extends PolicyHierarchyDto {
    totalPoliciesInHierarchy: number;
    averageDepth: number;
    maxDepth: number;
}
