import { GovernanceIntegrationsService } from './governance-integrations.service';
import { CreateIntegrationHookDto } from './dto/create-hook.dto';
export declare class GovernanceIntegrationsController {
    private readonly integrationsService;
    constructor(integrationsService: GovernanceIntegrationsService);
    create(dto: CreateIntegrationHookDto, req: any): Promise<import("./entities/integration-hook.entity").GovernanceIntegrationHook>;
    findAll(): Promise<import("./entities/integration-hook.entity").GovernanceIntegrationHook[]>;
    getLogs(id: string): Promise<import("./entities/integration-hook.entity").GovernanceIntegrationLog[]>;
    handleWebhook(secret: string, payload: any, req: any): Promise<any>;
}
