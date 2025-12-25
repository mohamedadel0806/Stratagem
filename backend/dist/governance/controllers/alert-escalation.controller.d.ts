import { AlertEscalationService } from '../services/alert-escalation.service';
import { CreateEscalationChainDto, EscalationChainDto, EscalateAlertDto, ResolveEscalationChainDto, EscalationStatisticsDto } from '../dto/alert-escalation.dto';
import { AlertSeverity } from '../entities/alert.entity';
export declare class AlertEscalationController {
    private readonly escalationService;
    constructor(escalationService: AlertEscalationService);
    createEscalationChain(dto: CreateEscalationChainDto, req: any): Promise<EscalationChainDto>;
    getEscalationChain(id: string): Promise<EscalationChainDto>;
    getAlertEscalationChains(alertId: string): Promise<EscalationChainDto[]>;
    getActiveEscalationChains(): Promise<EscalationChainDto[]>;
    getEscalationChainsBySeverity(severity: AlertSeverity): Promise<EscalationChainDto[]>;
    escalateAlert(id: string, dto: EscalateAlertDto, req: any): Promise<EscalationChainDto>;
    resolveEscalationChain(id: string, dto: ResolveEscalationChainDto, req: any): Promise<EscalationChainDto>;
    cancelEscalationChain(id: string, req: any): Promise<EscalationChainDto>;
    getEscalationStatistics(): Promise<EscalationStatisticsDto>;
}
