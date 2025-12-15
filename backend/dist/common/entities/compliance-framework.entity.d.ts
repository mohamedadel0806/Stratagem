import { ComplianceRequirement } from './compliance-requirement.entity';
export declare class ComplianceFramework {
    id: string;
    name: string;
    code: string;
    description: string;
    region: string;
    organizationId: string;
    requirements: ComplianceRequirement[];
    createdAt: Date;
    updatedAt: Date;
}
