import { CriticalityLevel } from '../entities/physical-asset.entity';
export declare class SupplierQueryDto {
    search?: string;
    supplierType?: string;
    criticalityLevel?: CriticalityLevel;
    businessUnit?: string;
    page?: number;
    limit?: number;
}
