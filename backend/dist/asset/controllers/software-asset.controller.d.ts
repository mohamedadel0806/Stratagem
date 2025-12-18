import { SoftwareAssetService } from '../services/software-asset.service';
import { ImportService } from '../services/import.service';
import { CreateSoftwareAssetDto } from '../dto/create-software-asset.dto';
import { UpdateSoftwareAssetDto } from '../dto/update-software-asset.dto';
import { SoftwareAssetResponseDto } from '../dto/software-asset-response.dto';
import { SoftwareAssetQueryDto } from '../dto/software-asset-query.dto';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class SoftwareAssetController {
    private readonly softwareService;
    private readonly importService;
    private readonly riskAssetLinkService;
    constructor(softwareService: SoftwareAssetService, importService: ImportService, riskAssetLinkService: RiskAssetLinkService);
    create(createDto: CreateSoftwareAssetDto, user: User): Promise<SoftwareAssetResponseDto>;
    findAll(query: SoftwareAssetQueryDto): Promise<{
        data: SoftwareAssetResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<SoftwareAssetResponseDto>;
    update(id: string, updateDto: UpdateSoftwareAssetDto, user: User): Promise<SoftwareAssetResponseDto>;
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
    getInventoryReport(groupBy?: 'type' | 'vendor' | 'none'): Promise<{
        summary: {
            totalSoftware: number;
            totalInstallations: number;
            unlicensedCount: number;
            expiredLicenseCount: number;
        };
        grouped: Record<string, {
            softwareName: string;
            version: string;
            patchLevel: string;
            vendor: string;
            softwareType: string;
            installationCount: number;
            licenseCount: number | null;
            licenseType: string | null;
            licenseExpiry: Date | null;
            licenseStatus: "licensed" | "unlicensed" | "expired" | "unknown";
            businessUnits: string[];
            locations: string[];
        }[]>;
        unlicensed: Array<{
            softwareName: string;
            version: string;
            patchLevel: string;
            vendor: string;
            softwareType: string;
            installationCount: number;
            businessUnits: string[];
            reason: "no_license" | "expired_license" | "installation_exceeds_license";
        }>;
    }>;
}
