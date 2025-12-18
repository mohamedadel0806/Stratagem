import { ComplianceFramework } from '../../../common/entities/compliance-framework.entity';
export declare class FrameworkRequirement {
    id: string;
    framework_id: string;
    framework: ComplianceFramework;
    requirement_identifier: string;
    title: string;
    requirement_text: string;
    description: string;
    domain: string;
    category: string;
    subcategory: string;
    display_order: number;
    created_at: Date;
    updated_at: Date;
}
