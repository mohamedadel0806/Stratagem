import { SupplierService } from '../supplier.service';
import { CreateSupplierDto } from '../../dto/create-supplier.dto';
import { BaseImportHandler } from './base-import-handler';
export declare class SupplierImportHandler extends BaseImportHandler {
    private supplierService;
    constructor(supplierService: SupplierService);
    mapFields(row: Record<string, any>, mapping: Record<string, string>): CreateSupplierDto;
    validate(data: CreateSupplierDto): string[];
    createAsset(data: CreateSupplierDto, userId: string): Promise<any>;
}
