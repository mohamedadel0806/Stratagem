import { GovernanceFrameworkConfigService } from './governance-framework-config.service';
import { CreateGovernanceFrameworkConfigDto } from './dto/create-governance-framework-config.dto';
import { UpdateGovernanceFrameworkConfigDto } from './dto/update-governance-framework-config.dto';
import { GovernanceFrameworkConfigQueryDto } from './dto/governance-framework-config-query.dto';
export declare class GovernanceFrameworkConfigController {
    private readonly frameworkConfigService;
    constructor(frameworkConfigService: GovernanceFrameworkConfigService);
    create(createFrameworkConfigDto: CreateGovernanceFrameworkConfigDto, req: any): Promise<import("../entities/governance-framework-config.entity").GovernanceFrameworkConfig>;
    findAll(queryDto: GovernanceFrameworkConfigQueryDto): Promise<{
        data: import("../entities/governance-framework-config.entity").GovernanceFrameworkConfig[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findByFrameworkType(frameworkType: string): Promise<import("../entities/governance-framework-config.entity").GovernanceFrameworkConfig[]>;
    findActiveConfigs(): Promise<import("../entities/governance-framework-config.entity").GovernanceFrameworkConfig[]>;
    findOne(id: string): Promise<import("../entities/governance-framework-config.entity").GovernanceFrameworkConfig>;
    update(id: string, updateFrameworkConfigDto: UpdateGovernanceFrameworkConfigDto, req: any): Promise<import("../entities/governance-framework-config.entity").GovernanceFrameworkConfig>;
    activate(id: string, req: any): Promise<import("../entities/governance-framework-config.entity").GovernanceFrameworkConfig>;
    deactivate(id: string, req: any): Promise<import("../entities/governance-framework-config.entity").GovernanceFrameworkConfig>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
}
