import { Repository } from 'typeorm';
import { AssetDependency, AssetType } from '../entities/asset-dependency.entity';
import { CreateAssetDependencyDto } from '../dto/create-asset-dependency.dto';
import { AssetDependencyResponseDto } from '../dto/asset-dependency-response.dto';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { InformationAsset } from '../entities/information-asset.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { Supplier } from '../entities/supplier.entity';
export declare class AssetDependencyService {
    private dependencyRepository;
    private physicalAssetRepository;
    private informationAssetRepository;
    private businessApplicationRepository;
    private softwareAssetRepository;
    private supplierRepository;
    constructor(dependencyRepository: Repository<AssetDependency>, physicalAssetRepository: Repository<PhysicalAsset>, informationAssetRepository: Repository<InformationAsset>, businessApplicationRepository: Repository<BusinessApplication>, softwareAssetRepository: Repository<SoftwareAsset>, supplierRepository: Repository<Supplier>);
    private getAssetNameAndIdentifier;
    create(sourceAssetType: AssetType, sourceAssetId: string, createDto: CreateAssetDependencyDto, userId: string): Promise<AssetDependencyResponseDto>;
    findAll(assetType: AssetType, assetId: string): Promise<AssetDependencyResponseDto[]>;
    findIncoming(assetType: AssetType, assetId: string): Promise<AssetDependencyResponseDto[]>;
    remove(dependencyId: string): Promise<void>;
    checkDependencies(assetType: AssetType, assetId: string): Promise<{
        hasDependencies: boolean;
        outgoingCount: number;
        incomingCount: number;
        totalCount: number;
        outgoing: AssetDependencyResponseDto[];
        incoming: AssetDependencyResponseDto[];
    }>;
    getDependencyChain(assetType: AssetType, assetId: string, maxDepth?: number, direction?: 'outgoing' | 'incoming' | 'both'): Promise<{
        chain: Array<{
            assetType: AssetType;
            assetId: string;
            assetName: string;
            assetIdentifier: string;
            depth: number;
            path: Array<{
                assetType: AssetType;
                assetId: string;
            }>;
        }>;
        totalCount: number;
        maxDepthReached: number;
    }>;
    private toResponseDto;
}
