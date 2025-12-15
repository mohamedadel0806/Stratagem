import { Repository } from 'typeorm';
import { InformationAsset } from '../entities/information-asset.entity';
import { CreateInformationAssetDto } from '../dto/create-information-asset.dto';
import { UpdateInformationAssetDto } from '../dto/update-information-asset.dto';
import { InformationAssetResponseDto } from '../dto/information-asset-response.dto';
import { InformationAssetQueryDto } from '../dto/information-asset-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class InformationAssetService {
    private assetRepository;
    private auditService;
    private riskAssetLinkService;
    constructor(assetRepository: Repository<InformationAsset>, auditService: AssetAuditService, riskAssetLinkService: RiskAssetLinkService);
    findAll(query?: InformationAssetQueryDto): Promise<{
        data: InformationAssetResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<InformationAssetResponseDto>;
    create(createDto: CreateInformationAssetDto, userId: string): Promise<InformationAssetResponseDto>;
    update(id: string, updateDto: UpdateInformationAssetDto, userId: string): Promise<InformationAssetResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    private getRiskCountForAsset;
    private getRiskCountsForAssets;
    private toResponseDto;
    private generateUniqueIdentifier;
}
