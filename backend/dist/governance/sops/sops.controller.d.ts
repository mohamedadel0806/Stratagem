import { SOPsService } from './sops.service';
import { CreateSOPDto } from './dto/create-sop.dto';
import { UpdateSOPDto } from './dto/update-sop.dto';
import { SOPQueryDto } from './dto/sop-query.dto';
export declare class SOPsController {
    private readonly sopsService;
    constructor(sopsService: SOPsService);
    create(createSOPDto: CreateSOPDto, req: any): Promise<import("./entities/sop.entity").SOP>;
    findAll(queryDto: SOPQueryDto): Promise<{
        data: import("./entities/sop.entity").SOP[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/sop.entity").SOP>;
    update(id: string, updateSOPDto: UpdateSOPDto, req: any): Promise<import("./entities/sop.entity").SOP>;
    remove(id: string): Promise<void>;
    publish(id: string, body: {
        assign_to_user_ids?: string[];
        assign_to_role_ids?: string[];
    }, req: any): Promise<import("./entities/sop.entity").SOP>;
    getMyAssignedSOPs(queryDto: SOPQueryDto, req: any): Promise<{
        data: import("./entities/sop.entity").SOP[];
        meta: any;
    }>;
    getPublicationStatistics(): Promise<{
        totalPublished: number;
        publishedThisMonth: number;
        publishedThisYear: number;
        assignmentsCount: number;
        acknowledgedCount: number;
        acknowledgmentRate: number;
    }>;
}
