import { CriticalityLevel } from '../entities/physical-asset.entity';
export declare class ContactDto {
    name: string;
    title: string;
    email: string;
    phone: string;
}
export declare class CreateSupplierDto {
    uniqueIdentifier?: string;
    supplierName: string;
    supplierType?: string;
    businessPurpose?: string;
    ownerId?: string;
    businessUnitId?: string;
    goodsServicesType?: string[];
    criticalityLevel?: CriticalityLevel;
    contractReference?: string;
    contractStartDate?: string;
    contractEndDate?: string;
    contractValue?: number;
    currency?: string;
    autoRenewal?: boolean;
    primaryContact?: ContactDto;
    secondaryContact?: ContactDto;
    taxId?: string;
    registrationNumber?: string;
    address?: string;
    country?: string;
    website?: string;
    riskAssessmentDate?: string;
    riskLevel?: string;
    complianceCertifications?: string[];
    insuranceVerified?: boolean;
    backgroundCheckDate?: string;
    performanceRating?: number;
    lastReviewDate?: string;
}
