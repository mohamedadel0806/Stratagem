import { CriticalityLevel } from '../entities/physical-asset.entity';
export declare class SupplierResponseDto {
    id: string;
    uniqueIdentifier: string;
    supplierName: string;
    supplierType?: string;
    businessPurpose?: string;
    ownerId?: string;
    owner?: {
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
    goodsServicesType?: string[];
    criticalityLevel?: CriticalityLevel;
    contractReference?: string;
    contractStartDate?: Date;
    contractEndDate?: Date;
    contractValue?: number;
    currency?: string;
    autoRenewal?: boolean;
    primaryContact?: {
        name: string;
        title: string;
        email: string;
        phone: string;
    };
    secondaryContact?: {
        name: string;
        title: string;
        email: string;
        phone: string;
    };
    taxId?: string;
    registrationNumber?: string;
    address?: string;
    country?: string;
    website?: string;
    riskAssessmentDate?: Date;
    riskLevel?: string;
    complianceCertifications?: string[];
    insuranceVerified?: boolean;
    backgroundCheckDate?: Date;
    performanceRating?: number;
    lastReviewDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    riskCount?: number;
}
