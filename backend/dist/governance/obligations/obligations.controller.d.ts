import { ObligationsService } from './obligations.service';
import { CreateComplianceObligationDto } from './dto/create-obligation.dto';
import { ObligationQueryDto } from './dto/obligation-query.dto';
export declare class ObligationsController {
    private readonly obligationsService;
    constructor(obligationsService: ObligationsService);
    create(dto: CreateComplianceObligationDto, req: any): Promise<import("./entities/compliance-obligation.entity").ComplianceObligation>;
    findAll(query: ObligationQueryDto): Promise<{
        data: import("./entities/compliance-obligation.entity").ComplianceObligation[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getStatistics(): Promise<{
        byStatus: any[];
        byPriority: any[];
    }>;
    findOne(id: string): Promise<import("./entities/compliance-obligation.entity").ComplianceObligation>;
    update(id: string, dto: Partial<CreateComplianceObligationDto>, req: any): Promise<import("./entities/compliance-obligation.entity").ComplianceObligation>;
    remove(id: string): Promise<void>;
}
