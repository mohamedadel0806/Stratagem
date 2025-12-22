import { Repository } from 'typeorm';
import { ControlDomain } from './entities/domain.entity';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
export declare class DomainsService {
    private domainRepository;
    constructor(domainRepository: Repository<ControlDomain>);
    create(createDomainDto: CreateDomainDto, userId: string): Promise<ControlDomain>;
    findAll(includeInactive?: boolean): Promise<ControlDomain[]>;
    findOne(id: string): Promise<ControlDomain>;
    findHierarchy(): Promise<ControlDomain[]>;
    private loadChildren;
    update(id: string, updateDomainDto: UpdateDomainDto, userId: string): Promise<ControlDomain>;
    remove(id: string): Promise<void>;
    private validateNoCircularReference;
    getDomainStatistics(): Promise<{
        total: number;
        active: number;
        withChildren: number;
        withOwner: number;
    }>;
}
