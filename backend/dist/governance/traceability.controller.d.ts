import { TraceabilityService, TraceabilityGraph } from './services/traceability.service';
export declare class TraceabilityController {
    private readonly traceabilityService;
    constructor(traceabilityService: TraceabilityService);
    getGraph(rootId?: string, rootType?: string): Promise<TraceabilityGraph>;
}
