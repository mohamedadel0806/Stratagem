import { ComplianceRequirement } from './compliance-requirement.entity';
import { User } from '../../users/entities/user.entity';
export declare enum FrameworkStatus {
    ACTIVE = "active",
    DRAFT = "draft",
    DEPRECATED = "deprecated"
}
export declare class ComplianceFramework {
    id: string;
    framework_code: string;
    name: string;
    version: string;
    issuing_authority: string;
    description: string;
    effective_date: Date;
    url: string;
    status: FrameworkStatus;
    structure: {
        domains?: Array<{
            name: string;
            categories?: Array<{
                name: string;
                requirements?: Array<{
                    identifier: string;
                    title: string;
                    text: string;
                }>;
            }>;
        }>;
    };
    tags: string[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
    code: string;
    region: string;
    organizationId: string;
    requirements: ComplianceRequirement[];
}
