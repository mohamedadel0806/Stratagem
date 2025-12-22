import { User } from '../../../users/entities/user.entity';
export declare enum TemplateType {
    POLICY = "policy",
    SOP = "sop",
    STANDARD = "standard",
    REPORT = "report"
}
export declare class DocumentTemplate {
    id: string;
    name: string;
    description: string;
    type: TemplateType;
    category: string;
    content: string;
    structure: any;
    version: string;
    isActive: boolean;
    restricted_to_roles: string[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
