import { Repository } from 'typeorm';
import { ControlAssetMapping, AssetType } from '../entities/control-asset-mapping.entity';
import { UnifiedControl, ImplementationStatus } from '../entities/unified-control.entity';
import { CreateControlAssetMappingDto, BulkCreateControlAssetMappingDto } from '../dto/create-control-asset-mapping.dto';
import { UpdateControlAssetMappingDto } from '../dto/update-control-asset-mapping.dto';
import { ControlAssetMappingQueryDto } from '../dto/control-asset-mapping-query.dto';
export interface AssetCompliancePosture {
    assetId: string;
    assetType: AssetType;
    totalControls: number;
    implementedControls: number;
    partialControls: number;
    notImplementedControls: number;
    complianceScore: number;
    controls: Array<{
        controlId: string;
        controlIdentifier: string;
        title: string;
        implementationStatus: ImplementationStatus;
        effectivenessScore?: number;
        lastTestDate?: Date;
        implementationDate?: Date;
    }>;
}
export interface AssetTypeComplianceOverview {
    assetType: AssetType;
    totalAssets: number;
    assetsWithControls: number;
    assetsWithoutControls: number;
    averageComplianceScore: number;
    complianceDistribution: {
        excellent: number;
        good: number;
        fair: number;
        poor: number;
    };
    topCompliantAssets: Array<{
        assetId: string;
        complianceScore: number;
        totalControls: number;
    }>;
}
export declare class ControlAssetMappingService {
    private mappingRepository;
    private controlRepository;
    private readonly logger;
    constructor(mappingRepository: Repository<ControlAssetMapping>, controlRepository: Repository<UnifiedControl>);
    create(controlId: string, createDto: CreateControlAssetMappingDto, userId: string): Promise<ControlAssetMapping>;
    bulkCreate(controlId: string, bulkDto: BulkCreateControlAssetMappingDto, userId: string): Promise<ControlAssetMapping[]>;
    findAll(controlId: string, queryDto: ControlAssetMappingQueryDto): Promise<ControlAssetMapping[]>;
    findOne(controlId: string, mappingId: string): Promise<ControlAssetMapping>;
    update(controlId: string, mappingId: string, updateDto: UpdateControlAssetMappingDto): Promise<ControlAssetMapping>;
    remove(controlId: string, mappingId: string): Promise<void>;
    removeByAsset(controlId: string, assetType: AssetType, assetId: string): Promise<void>;
    bulkRemove(controlId: string, mappingIds: string[]): Promise<{
        deleted: number;
        notFound: string[];
    }>;
    getAssetsByControl(controlId: string): Promise<ControlAssetMapping[]>;
    getControlsByAsset(assetType: AssetType, assetId: string): Promise<ControlAssetMapping[]>;
    linkControlsToAsset(assetType: AssetType, assetId: string, controlIds: string[], implementationStatus?: string, implementationNotes?: string, userId?: string): Promise<{
        created: ControlAssetMapping[];
        alreadyLinked: string[];
    }>;
    getAssetCompliancePosture(assetType: AssetType, assetId: string): Promise<AssetCompliancePosture>;
    getAssetTypeComplianceOverview(assetType: AssetType): Promise<AssetTypeComplianceOverview>;
    getControlAssetMatrix(filters?: {
        assetType?: AssetType;
        controlDomain?: string;
        implementationStatus?: ImplementationStatus;
    }): Promise<{
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
    }>, userId: string): Promise<{
        updated: number;
        notFound: number;
        errors: Array<{
            controlId: string;
            assetId: string;
            error: string;
        }>;
    }>;
}
