import { Repository } from 'typeorm';
import { BusinessApplication } from '../entities/business-application.entity';
import { CreateBusinessApplicationDto } from '../dto/create-business-application.dto';
import { UpdateBusinessApplicationDto } from '../dto/update-business-application.dto';
import { BusinessApplicationResponseDto } from '../dto/business-application-response.dto';
import { BusinessApplicationQueryDto } from '../dto/business-application-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class BusinessApplicationService {
    private applicationRepository;
    private auditService;
    private riskAssetLinkService;
    constructor(applicationRepository: Repository<BusinessApplication>, auditService: AssetAuditService, riskAssetLinkService: RiskAssetLinkService);
    findAll(query?: BusinessApplicationQueryDto): Promise<{
        data: BusinessApplicationResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<BusinessApplicationResponseDto>;
    create(createDto: CreateBusinessApplicationDto, userId: string): Promise<BusinessApplicationResponseDto>;
    update(id: string, updateDto: UpdateBusinessApplicationDto, userId: string): Promise<BusinessApplicationResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    private getRiskCountForAsset;
    private getRiskCountsForAssets;
    private toResponseDto;
    private generateUniqueIdentifier;
}
