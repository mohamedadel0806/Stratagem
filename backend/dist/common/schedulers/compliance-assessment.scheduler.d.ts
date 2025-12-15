import { Repository } from 'typeorm';
import { ComplianceAssessmentService } from '../services/compliance-assessment.service';
import { PhysicalAsset } from '../../asset/entities/physical-asset.entity';
import { InformationAsset } from '../../asset/entities/information-asset.entity';
import { BusinessApplication } from '../../asset/entities/business-application.entity';
import { SoftwareAsset } from '../../asset/entities/software-asset.entity';
import { Supplier } from '../../asset/entities/supplier.entity';
export declare class ComplianceAssessmentScheduler {
    private readonly assessmentService;
    private physicalAssetRepository;
    private informationAssetRepository;
    private businessApplicationRepository;
    private softwareAssetRepository;
    private supplierRepository;
    private readonly logger;
    constructor(assessmentService: ComplianceAssessmentService, physicalAssetRepository: Repository<PhysicalAsset>, informationAssetRepository: Repository<InformationAsset>, businessApplicationRepository: Repository<BusinessApplication>, softwareAssetRepository: Repository<SoftwareAsset>, supplierRepository: Repository<Supplier>);
    handleScheduledAssessments(): Promise<void>;
    private assessAssetType;
    handleUpdatedAssetsAssessments(): Promise<void>;
}
