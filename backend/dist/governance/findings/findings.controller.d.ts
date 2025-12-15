import { FindingsService } from './findings.service';
import { CreateFindingDto } from './dto/create-finding.dto';
import { FindingQueryDto } from './dto/finding-query.dto';
import { RiskFindingLinkService } from '../../risk/services/risk-finding-link.service';
export declare class FindingsController {
    private readonly findingsService;
    private readonly riskFindingLinkService;
    constructor(findingsService: FindingsService, riskFindingLinkService: RiskFindingLinkService);
    create(createDto: CreateFindingDto, req: any): Promise<import("./entities/finding.entity").Finding>;
    findAll(queryDto: FindingQueryDto): Promise<{
        data: import("./entities/finding.entity").Finding[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/finding.entity").Finding>;
    update(id: string, updateDto: Partial<CreateFindingDto>, req: any): Promise<import("./entities/finding.entity").Finding>;
    remove(id: string): Promise<void>;
    getRisks(findingId: string): Promise<any[]>;
}
