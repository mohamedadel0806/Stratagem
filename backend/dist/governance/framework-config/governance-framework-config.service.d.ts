import { Repository } from 'typeorm';
import { GovernanceFrameworkConfig } from '../entities/governance-framework-config.entity';
import { ComplianceFramework } from '../../common/entities/compliance-framework.entity';
import { User } from '../../users/entities/user.entity';
import { CreateGovernanceFrameworkConfigDto } from './dto/create-governance-framework-config.dto';
import { UpdateGovernanceFrameworkConfigDto } from './dto/update-governance-framework-config.dto';
import { GovernanceFrameworkConfigQueryDto } from './dto/governance-framework-config-query.dto';
export declare class GovernanceFrameworkConfigService {
    private frameworkConfigRepository;
    private complianceFrameworkRepository;
    private userRepository;
    private readonly logger;
    constructor(frameworkConfigRepository: Repository<GovernanceFrameworkConfig>, complianceFrameworkRepository: Repository<ComplianceFramework>, userRepository: Repository<User>);
    create(createFrameworkConfigDto: CreateGovernanceFrameworkConfigDto, userId: string): Promise<GovernanceFrameworkConfig>;
    findAll(queryDto: GovernanceFrameworkConfigQueryDto): Promise<{
        data: GovernanceFrameworkConfig[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<GovernanceFrameworkConfig>;
    update(id: string, updateFrameworkConfigDto: UpdateGovernanceFrameworkConfigDto, userId: string): Promise<GovernanceFrameworkConfig>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    activate(id: string, userId: string): Promise<GovernanceFrameworkConfig>;
    deactivate(id: string, userId: string): Promise<GovernanceFrameworkConfig>;
    findByFrameworkType(frameworkType: string): Promise<GovernanceFrameworkConfig[]>;
    findActiveConfigs(): Promise<GovernanceFrameworkConfig[]>;
    private parseSortQuery;
}
