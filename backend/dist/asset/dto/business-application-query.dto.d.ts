import { CriticalityLevel } from '../entities/business-application.entity';
export declare class BusinessApplicationQueryDto {
    search?: string;
    applicationType?: string;
    criticalityLevel?: CriticalityLevel;
    businessUnit?: string;
    ownerId?: string;
    missingVersion?: boolean;
    missingPatch?: boolean;
    securityTestStatus?: string;
    page?: number;
    limit?: number;
}
