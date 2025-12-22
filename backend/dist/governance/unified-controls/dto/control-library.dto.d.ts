import { UnifiedControl } from '../entities/unified-control.entity';
export declare class ControlLibraryStatsDto {
    totalControls: number;
    activeControls: number;
    draftControls: number;
    deprecatedControls: number;
    byType: Record<string, number>;
    byComplexity: Record<string, number>;
    implementationRate: number;
}
export declare class ControlLibraryBrowseResponseDto {
    data: UnifiedControl[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare class ControlDomainTreeNodeDto {
    id: string;
    name: string;
    code?: string;
    controlCount: number;
    children: ControlDomainTreeNodeDto[];
}
export declare class ControlDashboardDto {
    recentControls: UnifiedControl[];
    draftControls: UnifiedControl[];
    implementedControls: UnifiedControl[];
    deprecatedControls: UnifiedControl[];
}
export declare class ControlEffectivenessDto {
    controlId: string;
    title: string;
    implementationStatus: string;
    lastUpdated: Date;
    avgEffectiveness: number;
    testHistory: Array<{
        date: Date;
        result: string;
    }>;
}
export declare class ImportControlsResultDto {
    created: number;
    skipped: number;
    errors: Array<{
        row: number;
        error: string;
    }>;
}
