import { PhysicalAssetService } from '../services/physical-asset.service';
import { ImportService } from '../services/import.service';
import { CreatePhysicalAssetDto } from '../dto/create-physical-asset.dto';
import { UpdatePhysicalAssetDto } from '../dto/update-physical-asset.dto';
import { PhysicalAssetResponseDto } from '../dto/physical-asset-response.dto';
import { PhysicalAssetQueryDto } from '../dto/physical-asset-query.dto';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class PhysicalAssetController {
    private readonly assetService;
    private readonly importService;
    private readonly riskAssetLinkService;
    constructor(assetService: PhysicalAssetService, importService: ImportService, riskAssetLinkService: RiskAssetLinkService);
    create(createDto: CreatePhysicalAssetDto, user: User): Promise<PhysicalAssetResponseDto>;
    findAll(query: PhysicalAssetQueryDto): Promise<{
        data: PhysicalAssetResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<PhysicalAssetResponseDto>;
    update(id: string, updateDto: UpdatePhysicalAssetDto, user: User): Promise<PhysicalAssetResponseDto>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    previewImport(file: Express.Multer.File, body: any): Promise<import("../services/import.service").ImportPreview>;
    importAssets(file: Express.Multer.File, user: {
        userId: string;
        email: string;
        role: string;
    }, body: any): Promise<import("../services/import.service").ImportResult>;
    getImportHistory(assetType?: string): Promise<import("../entities/import-log.entity").ImportLog[]>;
    getImportLog(id: string): Promise<import("../entities/import-log.entity").ImportLog>;
    getRisks(id: string): Promise<any[]>;
    getRiskScore(id: string): Promise<{
        total_risks: number;
        total_risk_score: number;
        max_risk_level: string;
        risk_breakdown: {
            level: string;
            count: number;
        }[];
    }>;
}
