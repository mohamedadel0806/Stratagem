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
            licenseStatus: 'licensed' | 'unlicensed' | 'expired' | 'unknown';
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
            reason: 'no_license' | 'expired_license' | 'installation_exceeds_license';
        }>;
    }>;
    private getLicenseStatus;
    private generateUniqueIdentifier;
}
