import { DomainsService } from './domains.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
export declare class DomainsController {
    private readonly domainsService;
    constructor(domainsService: DomainsService);
    create(createDomainDto: CreateDomainDto, req: any): Promise<import("./entities/domain.entity").ControlDomain>;
    findAll(includeInactive?: string): Promise<import("./entities/domain.entity").ControlDomain[]>;
    findHierarchy(): Promise<import("./entities/domain.entity").ControlDomain[]>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        withChildren: number;
        withOwner: number;
    }>;
    findOne(id: string): Promise<import("./entities/domain.entity").ControlDomain>;
    update(id: string, updateDomainDto: UpdateDomainDto, req: any): Promise<import("./entities/domain.entity").ControlDomain>;
    remove(id: string): Promise<void>;
}
