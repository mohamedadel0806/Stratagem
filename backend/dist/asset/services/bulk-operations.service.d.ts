import { Repository } from 'typeorm';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { InformationAsset } from '../entities/information-asset.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { Supplier } from '../entities/supplier.entity';
import { BulkUpdateDto, BulkUpdateResponseDto } from '../dto/bulk-update.dto';
export declare class BulkOperationsService {
    private physicalAssetRepository;
    private informationAssetRepository;
    private businessApplicationRepository;
    private softwareAssetRepository;
    private supplierRepository;
    constructor(physicalAssetRepository: Repository<PhysicalAsset>, informationAssetRepository: Repository<InformationAsset>, businessApplicationRepository: Repository<BusinessApplication>, softwareAssetRepository: Repository<SoftwareAsset>, supplierRepository: Repository<Supplier>);
    bulkUpdate(assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier', dto: BulkUpdateDto, userId: string): Promise<BulkUpdateResponseDto>;
    bulkDelete(assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier', assetIds: string[]): Promise<BulkUpdateResponseDto>;
    private getRepository;
}
