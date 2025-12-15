import { ClassificationLevel } from '../entities/information-asset.entity';
export declare class InformationAssetResponseDto {
    id: string;
    uniqueIdentifier: string;
    informationType: string;
    name: string;
    description?: string;
    classificationLevel: ClassificationLevel;
    classificationDate?: Date;
    reclassificationDate?: Date;
    reclassificationReminderSent?: boolean;
    informationOwnerId?: string;
    informationOwner?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    assetCustodianId?: string;
    assetCustodian?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    businessUnitId?: string;
    businessUnit?: {
        id: string;
        name: string;
        code?: string;
    };
    assetLocation?: string;
    storageMedium?: string;
    complianceRequirements?: string[];
    retentionPeriod?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    riskCount?: number;
}
