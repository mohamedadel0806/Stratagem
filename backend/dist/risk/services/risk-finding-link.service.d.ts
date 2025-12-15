import { Repository } from 'typeorm';
import { RiskFindingLink, RiskFindingRelationshipType } from '../entities/risk-finding-link.entity';
import { Risk } from '../entities/risk.entity';
import { Finding } from '../../governance/findings/entities/finding.entity';
import { CreateRiskFindingLinkDto, UpdateRiskFindingLinkDto } from '../dto/links/create-risk-finding-link.dto';
export interface RiskFindingLinkResponseDto {
    id: string;
    risk_id: string;
    finding_id: string;
    relationship_type?: RiskFindingRelationshipType;
    notes?: string;
    linked_by?: string;
    linked_at: string;
    risk_info?: {
        risk_id: string;
        title: string;
        current_risk_level?: string;
        current_risk_score?: number;
    };
    finding_info?: {
        finding_identifier: string;
        title: string;
        severity?: string;
        status?: string;
    };
}
export declare class RiskFindingLinkService {
    private linkRepository;
    private riskRepository;
    private findingRepository;
    constructor(linkRepository: Repository<RiskFindingLink>, riskRepository: Repository<Risk>, findingRepository: Repository<Finding>);
    findByRiskId(riskId: string): Promise<RiskFindingLinkResponseDto[]>;
    findByFindingId(findingId: string): Promise<RiskFindingLinkResponseDto[]>;
    getRisksForFinding(findingId: string): Promise<any[]>;
    getFindingsForRisk(riskId: string): Promise<any[]>;
    create(createDto: CreateRiskFindingLinkDto, userId?: string): Promise<RiskFindingLinkResponseDto>;
    update(linkId: string, updateDto: UpdateRiskFindingLinkDto, userId?: string): Promise<RiskFindingLinkResponseDto>;
    remove(linkId: string): Promise<void>;
    removeByRiskAndFinding(riskId: string, findingId: string): Promise<void>;
    private toResponseDto;
}
