import { PolicyHierarchyService, HierarchyNode } from './services/policy-hierarchy.service';
export declare class PolicyHierarchyController {
    private readonly hierarchyService;
    constructor(hierarchyService: PolicyHierarchyService);
    getPolicyHierarchy(): Promise<HierarchyNode[]>;
}
