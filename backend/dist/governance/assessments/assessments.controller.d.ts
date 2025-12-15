import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateAssessmentResultDto } from './dto/create-assessment-result.dto';
export declare class AssessmentsController {
    private readonly assessmentsService;
    constructor(assessmentsService: AssessmentsService);
    create(createDto: CreateAssessmentDto, req: any): Promise<import("./entities/assessment.entity").Assessment>;
    findAll(query: any): Promise<{
        data: import("./entities/assessment.entity").Assessment[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/assessment.entity").Assessment>;
    update(id: string, updateDto: Partial<CreateAssessmentDto>, req: any): Promise<import("./entities/assessment.entity").Assessment>;
    remove(id: string): Promise<void>;
    addResult(assessmentId: string, createResultDto: CreateAssessmentResultDto, req: any): Promise<import("./entities/assessment-result.entity").AssessmentResult>;
    getResults(assessmentId: string): Promise<import("./entities/assessment-result.entity").AssessmentResult[]>;
}
