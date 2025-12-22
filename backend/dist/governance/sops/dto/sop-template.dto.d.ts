import { TemplateStatus } from '../entities/sop-template.entity';
export declare class CreateSOPTemplateDto {
    template_key: string;
    title: string;
    category?: string;
    description?: string;
    purpose_template: string;
    scope_template: string;
    content_template: string;
    success_criteria_template?: string;
    status?: TemplateStatus;
    tags?: string[];
    metadata?: Record<string, any>;
}
export declare class UpdateSOPTemplateDto {
    title?: string;
    category?: string;
    description?: string;
    purpose_template?: string;
    scope_template?: string;
    content_template?: string;
    success_criteria_template?: string;
    status?: TemplateStatus;
    tags?: string[];
    metadata?: Record<string, any>;
}
export declare class SOPTemplateQueryDto {
    status?: TemplateStatus;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
}
