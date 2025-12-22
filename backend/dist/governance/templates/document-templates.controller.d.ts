import { DocumentTemplatesService } from './document-templates.service';
import { CreateDocumentTemplateDto } from './dto/create-template.dto';
import { TemplateQueryDto } from './dto/template-query.dto';
export declare class DocumentTemplatesController {
    private readonly templatesService;
    constructor(templatesService: DocumentTemplatesService);
    create(dto: CreateDocumentTemplateDto, req: any): Promise<import("./entities/document-template.entity").DocumentTemplate>;
    findAll(query: TemplateQueryDto): Promise<import("./entities/document-template.entity").DocumentTemplate[]>;
    findOne(id: string): Promise<import("./entities/document-template.entity").DocumentTemplate>;
    update(id: string, dto: Partial<CreateDocumentTemplateDto>, req: any): Promise<import("./entities/document-template.entity").DocumentTemplate>;
    remove(id: string): Promise<void>;
}
