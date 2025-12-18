import { ClassificationLevel } from '../entities/information-asset.entity';
export declare class InformationAssetQueryDto {
    search?: string;
    dataClassification?: ClassificationLevel;
    complianceRequirement?: string;
    businessUnit?: string;
    ownerId?: string;
    page?: number;
    limit?: number;
}
