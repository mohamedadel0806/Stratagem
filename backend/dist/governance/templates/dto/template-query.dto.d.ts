import { TemplateType } from '../entities/document-template.entity';
export declare class TemplateQueryDto {
    type?: TemplateType;
    category?: string;
    isActive?: boolean;
    search?: string;
}
