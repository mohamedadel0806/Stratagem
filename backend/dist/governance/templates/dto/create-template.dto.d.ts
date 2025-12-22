import { TemplateType } from '../entities/document-template.entity';
export declare class CreateDocumentTemplateDto {
    name: string;
    description?: string;
    type: TemplateType;
    category?: string;
    content: string;
    structure?: any;
    version?: string;
    isActive?: boolean;
    restricted_to_roles?: string[];
}
