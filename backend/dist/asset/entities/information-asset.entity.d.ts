import { User } from '../../users/entities/user.entity';
import { BusinessUnit } from '../../common/entities/business-unit.entity';
export declare enum ClassificationLevel {
    PUBLIC = "public",
    INTERNAL = "internal",
    CONFIDENTIAL = "confidential",
    RESTRICTED = "restricted",
    SECRET = "secret"
}
export declare class InformationAsset {
    id: string;
    uniqueIdentifier: string;
    informationType: string;
    name: string;
    description: string;
    classificationLevel: ClassificationLevel;
    classificationDate: Date;
    reclassificationDate: Date;
    reclassificationReminderSent: boolean;
    informationOwnerId: string;
    informationOwner: User;
    assetCustodianId: string;
    assetCustodian: User;
    businessUnitId: string;
    businessUnit: BusinessUnit;
    assetLocation: string;
    storageMedium: string;
    complianceRequirements: string[];
    retentionPeriod: string;
    createdBy: string;
    createdByUser: User;
    createdAt: Date;
    updatedBy: string;
    updatedByUser: User;
    updatedAt: Date;
    deletedAt: Date;
}
