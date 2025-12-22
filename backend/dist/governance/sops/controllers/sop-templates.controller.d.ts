import { SOPTemplatesService } from '../services/sop-templates.service';
import { CreateSOPTemplateDto, UpdateSOPTemplateDto, SOPTemplateQueryDto } from '../dto/sop-template.dto';
export declare class SOPTemplatesController {
    private readonly templatesService;
    constructor(templatesService: SOPTemplatesService);
    create(createDto: CreateSOPTemplateDto, req: any): Promise<import("../entities/sop-template.entity").SOPTemplate>;
    findAll(queryDto: SOPTemplateQueryDto): Promise<{
        data: import("../entities/sop-template.entity").SOPTemplate[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getActive(): Promise<import("../entities/sop-template.entity").SOPTemplate[]>;
    getByCategory(category: string): Promise<import("../entities/sop-template.entity").SOPTemplate[]>;
    findOne(id: string): Promise<import("../entities/sop-template.entity").SOPTemplate>;
    update(id: string, updateDto: UpdateSOPTemplateDto, req: any): Promise<import("../entities/sop-template.entity").SOPTemplate>;
    clone(id: string, body: {
        new_key: string;
    }, req: any): Promise<import("../entities/sop-template.entity").SOPTemplate>;
    remove(id: string): Promise<void>;
}
