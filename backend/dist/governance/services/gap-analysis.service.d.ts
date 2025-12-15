import { EntityManager } from 'typeorm';
import { GapAnalysisDto, GapAnalysisQueryDto } from '../dto/gap-analysis.dto';
export declare class GapAnalysisService {
    private entityManager;
    constructor(entityManager: EntityManager);
    performGapAnalysis(query?: GapAnalysisQueryDto): Promise<GapAnalysisDto>;
    private analyzeFrameworkGaps;
    private generateRecommendations;
}
