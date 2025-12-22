import { Repository } from 'typeorm';
import { Evidence } from './entities/evidence.entity';
import { EvidenceLinkage, EvidenceLinkType } from './entities/evidence-linkage.entity';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { NotificationService } from '../../common/services/notification.service';
export declare class EvidenceService {
    private evidenceRepository;
    private evidenceLinkageRepository;
    private notificationService?;
    private readonly logger;
    constructor(evidenceRepository: Repository<Evidence>, evidenceLinkageRepository: Repository<EvidenceLinkage>, notificationService?: NotificationService);
    create(createDto: CreateEvidenceDto, userId: string): Promise<Evidence>;
    findAll(query?: {
        page?: number;
        limit?: number;
        evidence_type?: string;
        status?: string;
        search?: string;
    }): Promise<{
        data: Evidence[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Evidence>;
    update(id: string, updateDto: Partial<CreateEvidenceDto>, userId: string): Promise<Evidence>;
    remove(id: string): Promise<void>;
    linkEvidence(evidenceId: string, linkType: EvidenceLinkType, linkedEntityId: string, description?: string, userId?: string): Promise<EvidenceLinkage>;
    getLinkedEvidence(linkType: EvidenceLinkType, linkedEntityId: string): Promise<Evidence[]>;
    generateEvidencePackage(options: {
        evidenceIds?: string[];
        controlId?: string;
        assessmentId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        data: Buffer;
        filename: string;
    }>;
}
