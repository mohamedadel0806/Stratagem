import { InformationAssetService } from '../services/information-asset.service';
import { ImportService } from '../services/import.service';
import { CreateInformationAssetDto } from '../dto/create-information-asset.dto';
import { UpdateInformationAssetDto } from '../dto/update-information-asset.dto';
import { InformationAssetResponseDto } from '../dto/information-asset-response.dto';
import { InformationAssetQueryDto } from '../dto/information-asset-query.dto';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class InformationAssetController {
    private readonly assetService;
    private readonly importService;
    private readonly riskAssetLinkService;
    constructor(assetService: InformationAssetService, importService: ImportService, riskAssetLinkService: RiskAssetLinkService);
    create(createDto: CreateInformationAssetDto, user: User): Promise<InformationAssetResponseDto>;
    findAll(query: InformationAssetQueryDto): Promise<{
        data: InformationAssetResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getReclassificationUpcoming(days?: string): Promise<{
        data: InformationAssetResponseDto[];
        total: number;
        days: number;
    }>;
    getAssetsMissingCompliance(): Promise<{
        data: InformationAssetResponseDto[];
        total: number;
    }>;
    getComplianceReport(complianceRequirement?: string): Promise<{
        data: InformationAssetResponseDto[];
        total: number;
        complianceRequirement?: string;
    }>;
    findOne(id: string): Promise<InformationAssetResponseDto>;
    update(id: string, updateDto: UpdateInformationAssetDto, user: User): Promise<InformationAssetResponseDto>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    previewImport(file: Express.Multer.File, body: any): Promise<import("../services/import.service").ImportPreview>;
    importAssets(file: Express.Multer.File, user: {
        userId: string;
        email: string;
        role: string;
    }, body: any): Promise<import("../services/import.service").ImportResult>;
    getImportHistory(): Promise<import("../entities/import-log.entity").ImportLog[]>;
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
