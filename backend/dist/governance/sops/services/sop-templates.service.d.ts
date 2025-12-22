import { Repository } from 'typeorm';
import { SOPTemplate } from '../entities/sop-template.entity';
import { CreateSOPTemplateDto, UpdateSOPTemplateDto, SOPTemplateQueryDto } from '../dto/sop-template.dto';
export declare class SOPTemplatesService {
    private templateRepository;
    private readonly logger;
    constructor(templateRepository: Repository<SOPTemplate>);
    create(createDto: CreateSOPTemplateDto, userId: string): Promise<SOPTemplate>;
    findAll(queryDto: SOPTemplateQueryDto): Promise<{
        data: SOPTemplate[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<SOPTemplate>;
    findByKey(templateKey: string): Promise<SOPTemplate>;
    update(id: string, updateDto: UpdateSOPTemplateDto, userId: string): Promise<SOPTemplate>;
    remove(id: string): Promise<void>;
    getActiveTemplates(): Promise<SOPTemplate[]>;
    getTemplatesByCategory(category: string): Promise<SOPTemplate[]>;
    cloneTemplate(id: string, newKey: string, userId: string): Promise<SOPTemplate>;
}
