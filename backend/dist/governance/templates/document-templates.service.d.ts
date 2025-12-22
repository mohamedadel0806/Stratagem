import { Repository } from 'typeorm';
import { DocumentTemplate } from './entities/document-template.entity';
import { CreateDocumentTemplateDto } from './dto/create-template.dto';
import { TemplateQueryDto } from './dto/template-query.dto';
export declare class DocumentTemplatesService {
    private templateRepository;
    private readonly logger;
    constructor(templateRepository: Repository<DocumentTemplate>);
    create(dto: CreateDocumentTemplateDto, userId: string): Promise<DocumentTemplate>;
    findAll(query: TemplateQueryDto): Promise<DocumentTemplate[]>;
    findOne(id: string): Promise<DocumentTemplate>;
    update(id: string, dto: Partial<CreateDocumentTemplateDto>, userId: string): Promise<DocumentTemplate>;
    remove(id: string): Promise<void>;
}
