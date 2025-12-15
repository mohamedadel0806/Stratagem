import { BusinessApplicationService } from '../services/business-application.service';
import { ImportService } from '../services/import.service';
import { CreateBusinessApplicationDto } from '../dto/create-business-application.dto';
import { UpdateBusinessApplicationDto } from '../dto/update-business-application.dto';
import { BusinessApplicationResponseDto } from '../dto/business-application-response.dto';
import { BusinessApplicationQueryDto } from '../dto/business-application-query.dto';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class BusinessApplicationController {
    private readonly applicationService;
    private readonly importService;
    private readonly riskAssetLinkService;
    constructor(applicationService: BusinessApplicationService, importService: ImportService, riskAssetLinkService: RiskAssetLinkService);
    create(createDto: CreateBusinessApplicationDto, user: User): Promise<BusinessApplicationResponseDto>;
    findAll(query: BusinessApplicationQueryDto): Promise<{
        data: BusinessApplicationResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<BusinessApplicationResponseDto>;
    update(id: string, updateDto: UpdateBusinessApplicationDto, user: User): Promise<BusinessApplicationResponseDto>;
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
