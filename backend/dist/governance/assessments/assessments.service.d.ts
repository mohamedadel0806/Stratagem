import { Repository } from 'typeorm';
import { Assessment } from './entities/assessment.entity';
import { AssessmentResult } from './entities/assessment-result.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateAssessmentResultDto } from './dto/create-assessment-result.dto';
import { NotificationService } from '../../common/services/notification.service';
export declare class AssessmentsService {
    private assessmentRepository;
    private assessmentResultRepository;
    private notificationService?;
    private readonly logger;
    constructor(assessmentRepository: Repository<Assessment>, assessmentResultRepository: Repository<AssessmentResult>, notificationService?: NotificationService);
    create(createDto: CreateAssessmentDto, userId: string): Promise<Assessment>;
    findAll(query?: {
        page?: number;
        limit?: number;
        status?: string;
        assessment_type?: string;
        search?: string;
    }): Promise<{
        data: Assessment[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Assessment>;
    update(id: string, updateDto: Partial<CreateAssessmentDto>, userId: string): Promise<Assessment>;
    remove(id: string): Promise<void>;
    addResult(createResultDto: CreateAssessmentResultDto, userId: string): Promise<AssessmentResult>;
    getResults(assessmentId: string): Promise<AssessmentResult[]>;
    private updateAssessmentSummary;
    private calculateOverallScore;
}
