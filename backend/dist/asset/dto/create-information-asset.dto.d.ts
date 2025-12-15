import { ClassificationLevel } from '../entities/information-asset.entity';
export declare class CreateInformationAssetDto {
    uniqueIdentifier?: string;
    informationType: string;
    name: string;
    description?: string;
    classificationLevel: ClassificationLevel;
    classificationDate?: string;
    reclassificationDate?: string;
    informationOwnerId?: string;
    assetCustodianId?: string;
    businessUnitId?: string;
    assetLocation?: string;
    storageMedium?: string;
    complianceRequirements?: string[];
    retentionPeriod?: string;
}
