import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Influencer } from '../influencers/entities/influencer.entity';
import { Policy } from '../policies/entities/policy.entity';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { AIService } from '../../common/services/ai.service';

import { ControlTest, ControlTestStatus } from '../unified-controls/entities/control-test.entity';

export interface AISuggestion {
  targetId: string;
  targetType: 'policy' | 'control';
  confidence: number;
  reasoning: string;
  matchScore: number;
}

@Injectable()
export class GovernanceAIService {
  private readonly logger = new Logger(GovernanceAIService.name);

  constructor(
    private readonly aiService: AIService,
    @InjectRepository(Influencer)
    private influencerRepository: Repository<Influencer>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
    @InjectRepository(ControlTest)
    private testRepository: Repository<ControlTest>,
  ) {}

  async suggestMappings(influencerId: string): Promise<AISuggestion[]> {
    if (!this.aiService.isAvailable()) {
      throw new Error('AI Service is not available. Please check configuration.');
    }

    const influencer = await this.influencerRepository.findOne({ where: { id: influencerId } });
    if (!influencer) {
      throw new Error('Influencer not found');
    }

    // Fetch policies and controls to match against
    const [policies, controls] = await Promise.all([
      this.policyRepository.find({ select: ['id', 'title', 'purpose', 'scope'], where: { deleted_at: IsNull() } }),
      this.controlRepository.find({ select: ['id', 'title', 'description', 'control_identifier'], where: { deleted_at: IsNull() } }),
    ]);

    const systemPrompt = `
      You are a specialized GRC (Governance, Risk, and Compliance) AI assistant. 
      Your task is to analyze a specific regulatory requirement (Influencer) and suggest semantic mappings to existing internal Policies and Unified Controls.
      
      Return your response in strict JSON format:
      {
        "suggestions": [
          {
            "targetId": "uuid",
            "targetType": "policy" | "control",
            "confidence": 0.0 to 1.0,
            "reasoning": "Brief explanation of why this matches",
            "matchScore": 0 to 100
          }
        ]
      }
    `;

    const userPrompt = `
      INFLUENCER REQUIREMENT:
      Name: ${influencer.name}
      Description: ${influencer.description}
      Category: ${influencer.category}
      
      AVAILABLE POLICIES:
      ${policies.map(p => `- [ID: ${p.id}] Title: ${p.title} | Purpose: ${p.purpose}`).join('\n')}
      
      AVAILABLE UNIFIED CONTROLS:
      ${controls.map(c => `- [ID: ${c.id}] [${c.control_identifier}] Title: ${c.title} | Description: ${c.description}`).join('\n')}
      
      Suggest the most relevant mappings. Focus on high-confidence matches.
    `;

    const result = await this.aiService.getChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { response_format: { type: 'json_object' } },
    );

    if (!result) return [];

    try {
      const parsed = JSON.parse(result);
      return parsed.suggestions || [];
    } catch (error) {
      this.logger.error(`Failed to parse AI suggestions: ${error.message}`);
      return [];
    }
  }

  async predictControlEffectiveness(controlId: string): Promise<{
    forecast: Array<{ date: string; score: number }>;
    reasoning: string;
    riskWarnings: string[];
  }> {
    if (!this.aiService.isAvailable()) {
      throw new Error('AI Service is not available.');
    }

    const control = await this.controlRepository.findOne({ where: { id: controlId } });
    if (!control) {
      throw new Error('Control not found');
    }

    // 1. Fetch historical test data (last 12 months)
    const historicalTests = await this.testRepository.find({
      where: { 
        unified_control_id: controlId, 
        status: ControlTestStatus.COMPLETED,
        deleted_at: IsNull()
      },
      order: { test_date: 'ASC' },
      take: 20
    });

    if (historicalTests.length < 2) {
      return {
        forecast: [],
        reasoning: "Insufficient historical data to generate a reliable AI prediction. At least 2 completed tests are required.",
        riskWarnings: ["Low data confidence"]
      };
    }

    const systemPrompt = `
      You are a predictive risk analyst. Your task is to analyze historical control effectiveness scores and forecast future performance for the next 90 days.
      
      Return your response in strict JSON format:
      {
        "forecast": [
          {"date": "YYYY-MM-DD", "score": 85}
        ],
        "reasoning": "Explanation based on historical patterns",
        "riskWarnings": ["List of potential failure points"]
      }
      
      Generate 3 forecast points: 30 days, 60 days, and 90 days from now.
    `;

    const userPrompt = `
      CONTROL: ${control.control_identifier} - ${control.title}
      TYPE: ${control.control_type}
      
      HISTORICAL PERFORMANCE (Last 20 Tests):
      ${historicalTests.map(t => `- Date: ${t.test_date} | Score: ${t.effectiveness_score}% | Result: ${t.result}`).join('\n')}
      
      CURRENT STATUS: ${control.implementation_status}
      
      Analyze the trend. If scores are declining, predict lower future scores and explain why. If stable, maintain the level. Identify seasonal or systemic risks.
    `;

    const result = await this.aiService.getChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { response_format: { type: 'json_object' } },
    );

    if (!result) throw new Error("AI failed to generate prediction");

    try {
      return JSON.parse(result);
    } catch (error) {
      this.logger.error(`Failed to parse AI prediction: ${error.message}`);
      throw new Error("Invalid AI response format");
    }
  }

  async simulatePolicyImpact(policyId: string, proposedChanges: Partial<Policy>): Promise<{
    affectedAreas: Array<{ entityType: string; entityId: string; label: string; impactDescription: string; severity: 'low' | 'medium' | 'high' }>;
    effortEstimate: string;
    riskSummary: string;
    recommendations: string[];
  }> {
    if (!this.aiService.isAvailable()) {
      throw new Error('AI Service is not available.');
    }

    const policy = await this.policyRepository.findOne({ 
      where: { id: policyId },
      relations: ['control_objectives', 'control_objectives.unified_controls']
    });
    
    if (!policy) throw new Error('Policy not found');

    const systemPrompt = `
      You are a GRC Impact Analyst. Your task is to simulate the downstream impact of changing a corporate policy.
      Analyze how changes to the policy statement, purpose, or scope will affect linked control objectives and unified controls.
      
      Return your response in strict JSON format:
      {
        "affectedAreas": [
          {
            "entityType": "control_objective" | "unified_control" | "assessment",
            "entityId": "uuid",
            "label": "Name of entity",
            "impactDescription": "How this entity is impacted",
            "severity": "low" | "medium" | "high"
          }
        ],
        "effortEstimate": "low" | "medium" | "high",
        "riskSummary": "Brief overview of implementation risk",
        "recommendations": ["List of steps to mitigate impact"]
      }
    `;

    const userPrompt = `
      CURRENT POLICY:
      Title: ${policy.title}
      Purpose: ${policy.purpose}
      Scope: ${policy.scope}
      
      LINKED CONTROL OBJECTIVES:
      ${policy.control_objectives.map(co => `- ${co.objective_identifier}: ${co.statement}`).join('\n')}
      
      PROPOSED CHANGES:
      ${JSON.stringify(proposedChanges, null, 2)}
      
      Simulate the impact. If the scope is expanding, identify which controls might need broader application. If the purpose is changing, identify which objectives might become obsolete.
    `;

    const result = await this.aiService.getChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { response_format: { type: 'json_object' } },
    );

    if (!result) throw new Error("AI failed to simulate impact");

    try {
      return JSON.parse(result);
    } catch (error) {
      this.logger.error(`Failed to parse AI simulation: ${error.message}`);
      throw new Error("Invalid AI response format");
    }
  }
}


