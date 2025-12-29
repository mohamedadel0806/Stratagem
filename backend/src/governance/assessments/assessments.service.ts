import { Injectable, NotFoundException, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Assessment } from './entities/assessment.entity';
import { AssessmentResult } from './entities/assessment-result.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateAssessmentResultDto } from './dto/create-assessment-result.dto';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';

@Injectable()
export class AssessmentsService {
  private readonly logger = new Logger(AssessmentsService.name);

  constructor(
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentResult)
    private assessmentResultRepository: Repository<AssessmentResult>,
    @Optional() private notificationService?: NotificationService,
  ) { }

  async create(createDto: CreateAssessmentDto, userId: string, tenantId: string): Promise<Assessment> {
    // @ts-ignore - TypeORM entity type inference issue
    const assessment = this.assessmentRepository.create({
      ...createDto,
      created_by: userId,
      tenant_id: tenantId,
    });

    const savedAssessment = await this.assessmentRepository.save(assessment);

    // Send notification to lead assessor if assigned
    if (this.notificationService && savedAssessment.lead_assessor_id) {
      try {
        await this.notificationService.create({
          userId: savedAssessment.lead_assessor_id,
          type: NotificationType.TASK_ASSIGNED,
          priority: NotificationPriority.MEDIUM,
          title: 'New Assessment Assigned',
          message: `You have been assigned as lead assessor for assessment "${savedAssessment.name}".`,
          entityType: 'assessment',
          entityId: savedAssessment.id,
          actionUrl: `/dashboard/governance/assessments/${savedAssessment.id}`,
        });
      } catch (error) {
        this.logger.error(`Failed to send notification on assessment creation: ${error.message}`, error.stack);
      }
    }

    return savedAssessment;
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    status?: string;
    assessment_type?: string;
    search?: string;
  }) {
    const { page = 1, limit = 25, status, assessment_type, search } = query || {};
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Assessment> = {};

    if (status) {
      where.status = status as any;
    }

    if (assessment_type) {
      where.assessment_type = assessment_type as any;
    }

    const queryBuilder = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.lead_assessor', 'lead_assessor')
      .leftJoinAndSelect('assessment.creator', 'creator')
      .leftJoinAndSelect('assessment.approver', 'approver');

    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }

    if (search) {
      queryBuilder.andWhere(
        '(assessment.name ILIKE :search OR assessment.description ILIKE :search OR assessment.assessment_identifier ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('assessment.created_at', 'DESC');

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: [
        'lead_assessor',
        'creator',
        'updater',
        'approver',
        'results',
        'results.unified_control',
        'results.assessor',
      ],
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    return assessment;
  }

  async update(id: string, updateDto: Partial<CreateAssessmentDto>, userId: string): Promise<Assessment> {
    const assessment = await this.findOne(id);
    const oldStatus = assessment.status;

    Object.assign(assessment, {
      ...updateDto,
      updated_by: userId,
    });

    const savedAssessment = await this.assessmentRepository.save(assessment);

    // Send notification if status changed to completed
    if (this.notificationService && oldStatus !== savedAssessment.status && savedAssessment.status === 'completed') {
      try {
        // Notify creator
        if (savedAssessment.created_by) {
          await this.notificationService.create({
            userId: savedAssessment.created_by,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'Assessment Completed',
            message: `Assessment "${savedAssessment.name}" has been completed.`,
            entityType: 'assessment',
            entityId: savedAssessment.id,
            actionUrl: `/dashboard/governance/assessments/${savedAssessment.id}`,
          });
        }

        // Notify approver if assigned
        if (savedAssessment.approved_by) {
          await this.notificationService.create({
            userId: savedAssessment.approved_by,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.HIGH,
            title: 'Assessment Ready for Approval',
            message: `Assessment "${savedAssessment.name}" has been completed and is ready for your approval.`,
            entityType: 'assessment',
            entityId: savedAssessment.id,
            actionUrl: `/dashboard/governance/assessments/${savedAssessment.id}`,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on assessment completion: ${error.message}`, error.stack);
      }
    }

    return savedAssessment;
  }

  async remove(id: string): Promise<void> {
    const assessment = await this.findOne(id);
    await this.assessmentRepository.softRemove(assessment);
  }

  async addResult(createResultDto: CreateAssessmentResultDto, userId: string): Promise<AssessmentResult> {
    // Verify assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: createResultDto.assessment_id },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${createResultDto.assessment_id} not found`);
    }

    const result = this.assessmentResultRepository.create({
      ...createResultDto,
      assessor_id: createResultDto.assessor_id || userId,
    });

    const savedResult = await this.assessmentResultRepository.save(result);

    // Update assessment summary
    await this.updateAssessmentSummary(createResultDto.assessment_id);

    return savedResult;
  }

  async getResults(assessmentId: string) {
    return this.assessmentResultRepository.find({
      where: { assessment_id: assessmentId },
      relations: ['unified_control', 'assessor'],
      order: { created_at: 'DESC' },
    });
  }

  private async updateAssessmentSummary(assessmentId: string): Promise<void> {
    const results = await this.assessmentResultRepository.find({
      where: { assessment_id: assessmentId },
    });

    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) return;

    assessment.controls_assessed = results.length;
    assessment.overall_score = this.calculateOverallScore(results);

    await this.assessmentRepository.save(assessment);
  }

  private calculateOverallScore(results: AssessmentResult[]): number {
    if (results.length === 0) return 0;

    const scores: Record<string, number> = {
      compliant: 100,
      partially_compliant: 50,
      non_compliant: 0,
      not_applicable: 100,
      not_tested: 0,
    };

    const totalScore = results.reduce((sum, result) => {
      return sum + (scores[result.result] || 0);
    }, 0);

    return totalScore / results.length;
  }
}

