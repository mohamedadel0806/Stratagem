import { Repository } from 'typeorm';
import { Influencer } from '../influencers/entities/influencer.entity';
import { Policy } from '../policies/entities/policy.entity';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { AIService } from '../../common/services/ai.service';
import { ControlTest } from '../unified-controls/entities/control-test.entity';
export interface AISuggestion {
    targetId: string;
    targetType: 'policy' | 'control';
    confidence: number;
    reasoning: string;
    matchScore: number;
}
export declare class GovernanceAIService {
    private readonly aiService;
    private influencerRepository;
    private policyRepository;
    private controlRepository;
    private testRepository;
    private readonly logger;
    constructor(aiService: AIService, influencerRepository: Repository<Influencer>, policyRepository: Repository<Policy>, controlRepository: Repository<UnifiedControl>, testRepository: Repository<ControlTest>);
    suggestMappings(influencerId: string): Promise<AISuggestion[]>;
    predictControlEffectiveness(controlId: string): Promise<{
        forecast: Array<{
            date: string;
            score: number;
        }>;
        reasoning: string;
        riskWarnings: string[];
    }>;
    simulatePolicyImpact(policyId: string, proposedChanges: Partial<Policy>): Promise<{
        affectedAreas: Array<{
            entityType: string;
            entityId: string;
            label: string;
            impactDescription: string;
            severity: 'low' | 'medium' | 'high';
        }>;
        effortEstimate: string;
        riskSummary: string;
        recommendations: string[];
    }>;
}
