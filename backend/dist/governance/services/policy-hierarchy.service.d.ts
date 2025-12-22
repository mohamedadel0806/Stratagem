import { EntityManager } from 'typeorm';
export interface HierarchyNode {
    id: string;
    type: 'policy' | 'standard' | 'sop' | 'objective';
    label: string;
    identifier: string;
    status: string;
    children?: HierarchyNode[];
}
export declare class PolicyHierarchyService {
    private entityManager;
    private readonly logger;
    constructor(entityManager: EntityManager);
    getPolicyHierarchy(): Promise<HierarchyNode[]>;
}
