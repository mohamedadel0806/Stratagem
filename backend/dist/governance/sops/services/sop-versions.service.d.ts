import { Repository } from 'typeorm';
import { SOPVersion, VersionChangeType } from '../entities/sop-version.entity';
import { CreateSOPVersionDto, UpdateSOPVersionDto, ApproveSOPVersionDto, SOPVersionQueryDto } from '../dto/sop-version.dto';
import { SOP } from '../entities/sop.entity';
export declare class SOPVersionsService {
    private versionRepository;
    private sopRepository;
    private readonly logger;
    constructor(versionRepository: Repository<SOPVersion>, sopRepository: Repository<SOP>);
    create(createDto: CreateSOPVersionDto, userId: string): Promise<SOPVersion>;
    findAll(queryDto: SOPVersionQueryDto): Promise<{
        data: SOPVersion[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<SOPVersion>;
    update(id: string, updateDto: UpdateSOPVersionDto, userId: string): Promise<SOPVersion>;
    approve(id: string, approveDto: ApproveSOPVersionDto, userId: string): Promise<SOPVersion>;
    publish(id: string, userId: string): Promise<SOPVersion>;
    submitForApproval(id: string, userId: string): Promise<SOPVersion>;
    remove(id: string): Promise<void>;
    getVersionHistory(sopId: string): Promise<SOPVersion[]>;
    getLatestVersion(sopId: string): Promise<SOPVersion | null>;
    getPendingApprovals(): Promise<SOPVersion[]>;
    calculateNextVersion(sopId: string, changeType: VersionChangeType): Promise<string>;
    getVersionsRequiringRetraining(sopId: string): Promise<SOPVersion[]>;
}
