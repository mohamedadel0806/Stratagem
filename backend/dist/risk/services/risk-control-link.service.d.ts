import { Repository } from 'typeorm';
import { RiskControlLink } from '../entities/risk-control-link.entity';
import { Risk } from '../entities/risk.entity';
import { UnifiedControl } from '../../governance/unified-controls/entities/unified-control.entity';
import { CreateRiskControlLinkDto, UpdateRiskControlLinkDto } from '../dto/links/create-risk-control-link.dto';
export interface RiskControlLinkResponseDto {
    id: string;
    risk_id: string;
    control_id: string;
    effectiveness_rating?: number;
    effectiveness_type: string;
    effectiveness_percentage?: number;
    control_type_for_risk?: string;
    notes?: string;
    linked_by?: string;
    linked_at: string;
    last_effectiveness_review?: string;
    control_info?: {
        control_identifier: string;
        title: string;
        control_type?: string;
        implementation_status?: string;
    };
}
export declare class RiskControlLinkService {
    private linkRepository;
    private riskRepository;
    private controlRepository;
    constructor(linkRepository: Repository<RiskControlLink>, riskRepository: Repository<Risk>, controlRepository: Repository<UnifiedControl>);
    findByRiskId(riskId: string): Promise<RiskControlLinkResponseDto[]>;
    findByControlId(controlId: string): Promise<RiskControlLinkResponseDto[]>;
    getRisksForControl(controlId: string): Promise<any[]>;
    create(createDto: CreateRiskControlLinkDto, userId?: string): Promise<RiskControlLinkResponseDto>;
    update(linkId: string, updateDto: UpdateRiskControlLinkDto, userId?: string): Promise<RiskControlLinkResponseDto>;
    remove(linkId: string): Promise<void>;
    removeByRiskAndControl(riskId: string, controlId: string): Promise<void>;
    getControlEffectiveness(riskId: string): Promise<{
        total_controls: number;
        average_effectiveness: number;
        effectiveness_by_type: {
            type: string;
            count: number;
            avg_effectiveness: number;
        }[];
    }>;
    findRisksWithoutControls(): Promise<any[]>;
    getControlEffectivenessForControl(controlId: string): Promise<{
        total_risks: number;
        average_effectiveness: number;
        effectiveness_by_risk: {
            risk_id: string;
            risk_title: string;
            effectiveness: number;
        }[];
    }>;
    private toResponseDto;
}
