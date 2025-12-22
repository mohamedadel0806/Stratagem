import { Repository } from 'typeorm';
import { ComplianceObligation } from './entities/compliance-obligation.entity';
import { CreateComplianceObligationDto } from './dto/create-obligation.dto';
import { ObligationQueryDto } from './dto/obligation-query.dto';
export declare class ObligationsService {
    private obligationRepository;
    private readonly logger;
    constructor(obligationRepository: Repository<ComplianceObligation>);
    create(dto: CreateComplianceObligationDto, userId: string): Promise<ComplianceObligation>;
    findAll(query: ObligationQueryDto): Promise<{
        data: ComplianceObligation[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<ComplianceObligation>;
    update(id: string, dto: Partial<CreateComplianceObligationDto>, userId: string): Promise<ComplianceObligation>;
    remove(id: string): Promise<void>;
    getStatistics(): Promise<{
        byStatus: any[];
        byPriority: any[];
    }>;
    private generateIdentifier;
}
