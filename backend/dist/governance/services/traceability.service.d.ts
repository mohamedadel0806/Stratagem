import { EntityManager } from 'typeorm';
export interface TraceabilityNode {
    id: string;
    type: 'influencer' | 'policy' | 'objective' | 'control' | 'baseline';
    label: string;
    identifier: string;
    status: string;
    data?: any;
}
export interface TraceabilityLink {
    source: string;
    target: string;
    type: string;
}
export interface TraceabilityGraph {
    nodes: TraceabilityNode[];
    links: TraceabilityLink[];
}
export declare class TraceabilityService {
    private entityManager;
    private readonly logger;
    constructor(entityManager: EntityManager);
    getTraceabilityGraph(rootId?: string, rootType?: string): Promise<TraceabilityGraph>;
    private filterGraph;
}
