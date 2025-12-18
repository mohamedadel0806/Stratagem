import { SupplierService } from '../services/supplier.service';
import { ImportService } from '../services/import.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { SupplierResponseDto } from '../dto/supplier-response.dto';
import { SupplierQueryDto } from '../dto/supplier-query.dto';
import { User } from '../../users/entities/user.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class SupplierController {
    private readonly supplierService;
    private readonly importService;
    private readonly riskAssetLinkService;
    constructor(supplierService: SupplierService, importService: ImportService, riskAssetLinkService: RiskAssetLinkService);
    create(createDto: CreateSupplierDto, user: User): Promise<SupplierResponseDto>;
    findAll(query: SupplierQueryDto): Promise<{
        data: SupplierResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<SupplierResponseDto>;
    update(id: string, updateDto: UpdateSupplierDto, user: User): Promise<SupplierResponseDto>;
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
    getExpiringContracts(days?: string): Promise<{
        data: SupplierResponseDto[];
        total: number;
        days: number;
    }>;
    getCriticalSuppliersReport(): Promise<{
        data: SupplierResponseDto[];
        total: number;
    }>;
}
