import { Repository } from 'typeorm';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { CreateSoftwareAssetDto } from '../dto/create-software-asset.dto';
import { UpdateSoftwareAssetDto } from '../dto/update-software-asset.dto';
import { SoftwareAssetResponseDto } from '../dto/software-asset-response.dto';
import { SoftwareAssetQueryDto } from '../dto/software-asset-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class SoftwareAssetService {
    private softwareRepository;
    private auditService;
    private riskAssetLinkService;
    constructor(softwareRepository: Repository<SoftwareAsset>, auditService: AssetAuditService, riskAssetLinkService: RiskAssetLinkService);
    findAll(query?: SoftwareAssetQueryDto): Promise<{
        data: SoftwareAssetResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<SoftwareAssetResponseDto>;
    create(createDto: CreateSoftwareAssetDto, userId: string): Promise<SoftwareAssetResponseDto>;
    update(id: string, updateDto: UpdateSoftwareAssetDto, userId: string): Promise<SoftwareAssetResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    private getRiskCountForAsset;
    private getRiskCountsForAssets;
    private toResponseDto;
    private generateUniqueIdentifier;
}
