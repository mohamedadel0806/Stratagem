import { GovernanceAIService, AISuggestion } from './services/governance-ai.service';
export declare class GovernanceAIController {
    private readonly aiService;
    constructor(aiService: GovernanceAIService);
    suggestMappings(influencerId: string): Promise<AISuggestion[]>;
    predictEffectiveness(controlId: string): Promise<{
        forecast: Array<{
            date: string;
            score: number;
        }>;
        reasoning: string;
        riskWarnings: string[];
    }>;
    simulatePolicyImpact(policyId: string, proposedChanges: any): Promise<{
        affectedAreas: Array<{
            entityType: string;
            entityId: string;
            label: string;
            impactDescription: string;
            severity: "low" | "medium" | "high";
        }>;
        effortEstimate: string;
        riskSummary: string;
        recommendations: string[];
    }>;
}
