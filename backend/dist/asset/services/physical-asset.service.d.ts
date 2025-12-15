import { Repository } from 'typeorm';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { CreatePhysicalAssetDto } from '../dto/create-physical-asset.dto';
import { UpdatePhysicalAssetDto } from '../dto/update-physical-asset.dto';
import { PhysicalAssetResponseDto } from '../dto/physical-asset-response.dto';
import { PhysicalAssetQueryDto } from '../dto/physical-asset-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { AssetDependency } from '../entities/asset-dependency.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class PhysicalAssetService {
    private assetRepository;
    private dependencyRepository;
    private auditService;
    private riskAssetLinkService;
    constructor(assetRepository: Repository<PhysicalAsset>, dependencyRepository: Repository<AssetDependency>, auditService: AssetAuditService, riskAssetLinkService: RiskAssetLinkService);
    findAll(query?: PhysicalAssetQueryDto): Promise<{
        data: PhysicalAssetResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<PhysicalAssetResponseDto>;
    create(createDto: CreatePhysicalAssetDto, userId: string): Promise<PhysicalAssetResponseDto>;
    update(id: string, updateDto: UpdatePhysicalAssetDto, userId: string): Promise<PhysicalAssetResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    private generateUniqueIdentifier;
    private getRiskCountForAsset;
    private getRiskCountsForAssets;
    private toResponseDto;
}
