import { Response } from 'express';
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { EvidenceLinkType } from './entities/evidence-linkage.entity';
export declare class EvidenceController {
    private readonly evidenceService;
    constructor(evidenceService: EvidenceService);
    create(createDto: CreateEvidenceDto, req: any): Promise<import("./entities/evidence.entity").Evidence>;
    findAll(query: any): Promise<{
        data: import("./entities/evidence.entity").Evidence[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/evidence.entity").Evidence>;
    update(id: string, updateDto: Partial<CreateEvidenceDto>, req: any): Promise<import("./entities/evidence.entity").Evidence>;
    remove(id: string): Promise<void>;
    linkEvidence(evidenceId: string, body: {
        link_type: EvidenceLinkType;
        linked_entity_id: string;
        description?: string;
    }, req: any): Promise<import("./entities/evidence-linkage.entity").EvidenceLinkage>;
    getLinkedEvidence(linkType: EvidenceLinkType, linkedEntityId: string): Promise<import("./entities/evidence.entity").Evidence[]>;
    uploadFile(file: Express.Multer.File, body: any, req: any): Promise<any>;
    downloadFile(filename: string, res: Response): Promise<void>;
}
