import { User } from '../../../users/entities/user.entity';
export declare enum TemplateStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive",
    ARCHIVED = "archived"
}
export declare class SOPTemplate {
    id: string;
    template_key: string;
    title: string;
    category: string;
    description: string;
    purpose_template: string;
    scope_template: string;
    content_template: string;
    success_criteria_template: string;
    status: TemplateStatus;
    version_number: number;
    owner_id: string;
    owner: User;
    tags: string[];
    metadata: Record<string, any>;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
