import { ClassificationLevel } from '../entities/information-asset.entity';
export declare class InformationAssetQueryDto {
    search?: string;
    dataClassification?: ClassificationLevel;
    businessUnit?: string;
    ownerId?: string;
    page?: number;
    limit?: number;
}
