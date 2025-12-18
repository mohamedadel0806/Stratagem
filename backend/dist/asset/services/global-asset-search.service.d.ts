import { Repository } from 'typeorm';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { InformationAsset } from '../entities/information-asset.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { Supplier } from '../entities/supplier.entity';
import { GlobalAssetSearchQueryDto, GlobalAssetSearchResponseDto } from '../dto/global-asset-search.dto';
export declare class GlobalAssetSearchService {
    private physicalAssetRepository;
    private informationAssetRepository;
    private businessApplicationRepository;
    private softwareAssetRepository;
    private supplierRepository;
    private readonly logger;
    constructor(physicalAssetRepository: Repository<PhysicalAsset>, informationAssetRepository: Repository<InformationAsset>, businessApplicationRepository: Repository<BusinessApplication>, softwareAssetRepository: Repository<SoftwareAsset>, supplierRepository: Repository<Supplier>);
    search(query: GlobalAssetSearchQueryDto): Promise<GlobalAssetSearchResponseDto>;
}
