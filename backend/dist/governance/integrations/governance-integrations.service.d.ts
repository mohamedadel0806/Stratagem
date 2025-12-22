import { Repository } from 'typeorm';
import { GovernanceIntegrationHook, GovernanceIntegrationLog } from './entities/integration-hook.entity';
import { CreateIntegrationHookDto } from './dto/create-hook.dto';
import { EvidenceService } from '../evidence/evidence.service';
import { FindingsService } from '../findings/findings.service';
import { UnifiedControlsService } from '../unified-controls/unified-controls.service';
export declare class GovernanceIntegrationsService {
    private hookRepository;
    private logRepository;
    private evidenceService;
    private findingsService;
    private controlsService;
    private readonly logger;
    constructor(hookRepository: Repository<GovernanceIntegrationHook>, logRepository: Repository<GovernanceIntegrationLog>, evidenceService: EvidenceService, findingsService: FindingsService, controlsService: UnifiedControlsService);
    createHook(dto: CreateIntegrationHookDto, userId: string): Promise<GovernanceIntegrationHook>;
    findAll(): Promise<GovernanceIntegrationHook[]>;
    findOne(id: string): Promise<GovernanceIntegrationHook>;
    handleWebhook(secretKey: string, payload: any, ipAddress: string): Promise<any>;
    private processEvidenceHook;
    private processFindingHook;
    private mapField;
    getLogs(hookId: string): Promise<GovernanceIntegrationLog[]>;
}
