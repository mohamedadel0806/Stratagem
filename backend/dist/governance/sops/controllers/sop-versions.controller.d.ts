import { SOPVersionsService } from '../services/sop-versions.service';
import { CreateSOPVersionDto, UpdateSOPVersionDto, ApproveSOPVersionDto, SOPVersionQueryDto } from '../dto/sop-version.dto';
export declare class SOPVersionsController {
    private readonly versionsService;
    constructor(versionsService: SOPVersionsService);
    create(createDto: CreateSOPVersionDto, req: any): Promise<import("../entities/sop-version.entity").SOPVersion>;
    findAll(queryDto: SOPVersionQueryDto): Promise<{
        data: import("../entities/sop-version.entity").SOPVersion[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getHistory(sopId: string): Promise<import("../entities/sop-version.entity").SOPVersion[]>;
    getLatest(sopId: string): Promise<import("../entities/sop-version.entity").SOPVersion>;
    getPending(): Promise<import("../entities/sop-version.entity").SOPVersion[]>;
    getRetrainingVersions(sopId: string): Promise<import("../entities/sop-version.entity").SOPVersion[]>;
    findOne(id: string): Promise<import("../entities/sop-version.entity").SOPVersion>;
    update(id: string, updateDto: UpdateSOPVersionDto, req: any): Promise<import("../entities/sop-version.entity").SOPVersion>;
    submitApproval(id: string, req: any): Promise<import("../entities/sop-version.entity").SOPVersion>;
    approve(id: string, approveDto: ApproveSOPVersionDto, req: any): Promise<import("../entities/sop-version.entity").SOPVersion>;
    publish(id: string, req: any): Promise<import("../entities/sop-version.entity").SOPVersion>;
    remove(id: string): Promise<void>;
}
