import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { SupplierResponseDto } from '../dto/supplier-response.dto';
import { SupplierQueryDto } from '../dto/supplier-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
export declare class SupplierService {
    private supplierRepository;
    private auditService;
    private riskAssetLinkService;
    constructor(supplierRepository: Repository<Supplier>, auditService: AssetAuditService, riskAssetLinkService: RiskAssetLinkService);
    findAll(query?: SupplierQueryDto): Promise<{
        data: SupplierResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<SupplierResponseDto>;
    create(createDto: CreateSupplierDto, userId: string): Promise<SupplierResponseDto>;
    update(id: string, updateDto: UpdateSupplierDto, userId: string): Promise<SupplierResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    private getRiskCountForAsset;
    private getRiskCountsForAssets;
    getContractStatus(contractEndDate?: Date, autoRenewal?: boolean): 'active' | 'expired' | 'pending_renewal' | 'no_contract';
    getCriticalSuppliersReport(): Promise<SupplierResponseDto[]>;
    getExpiringContracts(days?: number): Promise<SupplierResponseDto[]>;
    private toResponseDto;
    private generateUniqueIdentifier;
}
