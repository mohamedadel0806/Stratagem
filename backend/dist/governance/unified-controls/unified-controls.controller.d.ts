import { UnifiedControlsService } from './unified-controls.service';
import { ControlAssetMappingService, AssetCompliancePosture, AssetTypeComplianceOverview } from './services/control-asset-mapping.service';
import { FrameworkControlMappingService } from './services/framework-control-mapping.service';
import { CreateUnifiedControlDto } from './dto/create-unified-control.dto';
import { UnifiedControlQueryDto } from './dto/unified-control-query.dto';
import { CreateControlAssetMappingDto, BulkCreateControlAssetMappingDto } from './dto/create-control-asset-mapping.dto';
import { BulkDeleteControlAssetMappingDto } from './dto/bulk-delete-control-asset-mapping.dto';
import { UpdateControlAssetMappingDto } from './dto/update-control-asset-mapping.dto';
import { ControlAssetMappingQueryDto } from './dto/control-asset-mapping-query.dto';
import { AssetType } from './entities/control-asset-mapping.entity';
import { ImplementationStatus } from './entities/unified-control.entity';
import { RiskControlLinkService } from '../../risk/services/risk-control-link.service';
export declare class UnifiedControlsController {
    private readonly unifiedControlsService;
    private readonly controlAssetMappingService;
    private readonly frameworkControlMappingService;
    private readonly riskControlLinkService;
    constructor(unifiedControlsService: UnifiedControlsService, controlAssetMappingService: ControlAssetMappingService, frameworkControlMappingService: FrameworkControlMappingService, riskControlLinkService: RiskControlLinkService);
    create(createDto: CreateUnifiedControlDto, req: any): Promise<import("./entities/unified-control.entity").UnifiedControl>;
    findAll(queryDto: UnifiedControlQueryDto): Promise<{
        data: import("./entities/unified-control.entity").UnifiedControl[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/unified-control.entity").UnifiedControl>;
    update(id: string, updateDto: Partial<CreateUnifiedControlDto>, req: any): Promise<import("./entities/unified-control.entity").UnifiedControl>;
    remove(id: string): Promise<void>;
    linkAsset(controlId: string, createDto: CreateControlAssetMappingDto, req: any): Promise<import("./entities/control-asset-mapping.entity").ControlAssetMapping>;
    bulkLinkAssets(controlId: string, bulkDto: BulkCreateControlAssetMappingDto, req: any): Promise<import("./entities/control-asset-mapping.entity").ControlAssetMapping[]>;
    getLinkedAssets(controlId: string, queryDto: ControlAssetMappingQueryDto): Promise<import("./entities/control-asset-mapping.entity").ControlAssetMapping[]>;
    getMapping(controlId: string, mappingId: string): Promise<import("./entities/control-asset-mapping.entity").ControlAssetMapping>;
    updateMapping(controlId: string, mappingId: string, updateDto: UpdateControlAssetMappingDto): Promise<import("./entities/control-asset-mapping.entity").ControlAssetMapping>;
    unlinkAsset(controlId: string, mappingId: string): Promise<void>;
    bulkUnlinkAssets(controlId: string, bulkDto: BulkDeleteControlAssetMappingDto): Promise<{
        deleted: number;
        notFound: string[];
    }>;
    getControlsForAsset(assetType: string, assetId: string, queryDto: ControlAssetMappingQueryDto): Promise<import("./entities/control-asset-mapping.entity").ControlAssetMapping[]>;
    linkControlsToAsset(assetType: string, assetId: string, body: {
        control_ids: string[];
        implementation_status?: string;
        implementation_notes?: string;
    }, req: any): Promise<{
        created: import("./entities/control-asset-mapping.entity").ControlAssetMapping[];
        alreadyLinked: string[];
    }>;
    unlinkControlFromAsset(assetType: string, assetId: string, controlId: string): Promise<void>;
    getAssetCompliancePosture(assetType: string, assetId: string): Promise<AssetCompliancePosture>;
    getAssetTypeComplianceOverview(assetType: string): Promise<AssetTypeComplianceOverview>;
    getControlAssetMatrix(assetType?: AssetType, controlDomain?: string, implementationStatus?: ImplementationStatus): Promise<{
        controls: Array<{
            id: string;
            identifier: string;
            title: string;
            domain: string;
            totalAssets: number;
            implementedAssets: number;
            partialAssets: number;
            notImplementedAssets: number;
        }>;
        assets: Array<{
            id: string;
            type: AssetType;
            complianceScore: number;
            totalControls: number;
        }>;
        matrix: Array<{
            controlId: string;
            assetId: string;
            implementationStatus: ImplementationStatus;
            effectivenessScore?: number;
        }>;
    }>;
    getControlEffectivenessSummary(controlId: string): Promise<{
        controlId: string;
        totalAssets: number;
        averageEffectiveness: number;
        effectivenessDistribution: {
            excellent: number;
            good: number;
            fair: number;
            poor: number;
        };
        assetEffectiveness: Array<{
            assetId: string;
            assetType: AssetType;
            effectivenessScore?: number;
            lastTestDate?: Date;
            implementationStatus: ImplementationStatus;
        }>;
    }>;
    bulkUpdateImplementationStatus(updates: Array<{
        controlId: string;
        assetType: AssetType;
        assetId: string;
        implementationStatus: ImplementationStatus;
        implementationNotes?: string;
        effectivenessScore?: number;
    }>, req: any): Promise<{
        updated: number;
        notFound: number;
        errors: Array<{
            controlId: string;
            assetId: string;
            error: string;
        }>;
    }>;
    getRisks(controlId: string): Promise<any[]>;
    getRiskEffectiveness(controlId: string): Promise<{
        total_risks: number;
        average_effectiveness: number;
        effectiveness_by_risk: {
            risk_id: string;
            risk_title: string;
            effectiveness: number;
        }[];
    }>;
    getFrameworkMappings(id: string): Promise<import("./entities/framework-control-mapping.entity").FrameworkControlMapping[]>;
    createFrameworkMapping(controlId: string, body: {
        requirement_id: string;
        coverage_level: string;
        mapping_notes?: string;
    }, req: any): Promise<import("./entities/framework-control-mapping.entity").FrameworkControlMapping>;
    bulkCreateFrameworkMappings(controlId: string, body: {
        requirement_ids: string[];
        coverage_level: string;
        mapping_notes?: string;
    }, req: any): Promise<{
        created: import("./entities/framework-control-mapping.entity").FrameworkControlMapping[];
        alreadyLinked: string[];
    }>;
    updateFrameworkMapping(mappingId: string, body: {
        coverage_level?: string;
        mapping_notes?: string;
    }): Promise<import("./entities/framework-control-mapping.entity").FrameworkControlMapping>;
    deleteFrameworkMapping(mappingId: string): Promise<void>;
    getCoverageMatrix(frameworkId: string): Promise<{
        requirementId: string;
        requirementIdentifier: string;
        requirementTitle: string;
        controlId: string;
        controlIdentifier: string;
        controlTitle: string;
        coverageLevel: import("./entities/framework-control-mapping.entity").MappingCoverage;
    }[]>;
    getLibraryStatistics(): Promise<{
        totalControls: number;
        activeControls: number;
        draftControls: number;
        deprecatedControls: number;
        byType: Record<string, number>;
        byComplexity: Record<string, number>;
        implementationRate: number;
    }>;
    getDomainTree(): Promise<any[]>;
    getActiveDomains(): Promise<import("../domains/entities/domain.entity").ControlDomain[]>;
    getControlTypes(): Promise<string[]>;
    browseLibrary(domain?: string, type?: string, complexity?: string, status?: string, implementationStatus?: string, search?: string, page?: number, limit?: number): Promise<{
        data: import("./entities/unified-control.entity").UnifiedControl[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getControlsDashboard(): Promise<{
        recentControls: import("./entities/unified-control.entity").UnifiedControl[];
        draftControls: import("./entities/unified-control.entity").UnifiedControl[];
        implementedControls: import("./entities/unified-control.entity").UnifiedControl[];
        deprecatedControls: import("./entities/unified-control.entity").UnifiedControl[];
    }>;
    exportControls(domain?: string, type?: string, status?: string): Promise<string>;
    importControls(importData: any[], req: any): Promise<{
        created: number;
        skipped: number;
        errors: Array<{
            row: number;
            error: string;
        }>;
    }>;
    getControlsByDomain(id: string): Promise<import("./entities/unified-control.entity").UnifiedControl[]>;
    getRelatedControls(id: string, limit?: number): Promise<import("./entities/unified-control.entity").UnifiedControl[]>;
    getControlEffectiveness(id: string): Promise<{
        controlId: string;
        title: string;
        implementationStatus: string;
        lastUpdated: Date;
        avgEffectiveness: number;
        testHistory: Array<{
            date: Date;
            result: string;
        }>;
    }>;
}
