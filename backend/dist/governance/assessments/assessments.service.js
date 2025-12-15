"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AssessmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_entity_1 = require("./entities/assessment.entity");
const assessment_result_entity_1 = require("./entities/assessment-result.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let AssessmentsService = AssessmentsService_1 = class AssessmentsService {
    constructor(assessmentRepository, assessmentResultRepository, notificationService) {
        this.assessmentRepository = assessmentRepository;
        this.assessmentResultRepository = assessmentResultRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(AssessmentsService_1.name);
    }
    async create(createDto, userId) {
        const assessment = this.assessmentRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId }));
        const savedAssessment = await this.assessmentRepository.save(assessment);
        if (this.notificationService && savedAssessment.lead_assessor_id) {
            try {
                await this.notificationService.create({
                    userId: savedAssessment.lead_assessor_id,
                    type: notification_entity_1.NotificationType.TASK_ASSIGNED,
                    priority: notification_entity_1.NotificationPriority.MEDIUM,
                    title: 'New Assessment Assigned',
                    message: `You have been assigned as lead assessor for assessment "${savedAssessment.name}".`,
                    entityType: 'assessment',
                    entityId: savedAssessment.id,
                    actionUrl: `/dashboard/governance/assessments/${savedAssessment.id}`,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send notification on assessment creation: ${error.message}`, error.stack);
            }
        }
        return savedAssessment;
    }
    async findAll(query) {
        const { page = 1, limit = 25, status, assessment_type, search } = query || {};
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (assessment_type) {
            where.assessment_type = assessment_type;
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
            queryBuilder.andWhere('(assessment.name ILIKE :search OR assessment.description ILIKE :search OR assessment.assessment_identifier ILIKE :search)', { search: `%${search}%` });
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Assessment with ID ${id} not found`);
        }
        return assessment;
    }
    async update(id, updateDto, userId) {
        const assessment = await this.findOne(id);
        const oldStatus = assessment.status;
        Object.assign(assessment, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        const savedAssessment = await this.assessmentRepository.save(assessment);
        if (this.notificationService && oldStatus !== savedAssessment.status && savedAssessment.status === 'completed') {
            try {
                if (savedAssessment.created_by) {
                    await this.notificationService.create({
                        userId: savedAssessment.created_by,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'Assessment Completed',
                        message: `Assessment "${savedAssessment.name}" has been completed.`,
                        entityType: 'assessment',
                        entityId: savedAssessment.id,
                        actionUrl: `/dashboard/governance/assessments/${savedAssessment.id}`,
                    });
                }
                if (savedAssessment.approved_by) {
                    await this.notificationService.create({
                        userId: savedAssessment.approved_by,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                        title: 'Assessment Ready for Approval',
                        message: `Assessment "${savedAssessment.name}" has been completed and is ready for your approval.`,
                        entityType: 'assessment',
                        entityId: savedAssessment.id,
                        actionUrl: `/dashboard/governance/assessments/${savedAssessment.id}`,
                    });
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on assessment completion: ${error.message}`, error.stack);
            }
        }
        return savedAssessment;
    }
    async remove(id) {
        const assessment = await this.findOne(id);
        await this.assessmentRepository.softRemove(assessment);
    }
    async addResult(createResultDto, userId) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id: createResultDto.assessment_id },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Assessment with ID ${createResultDto.assessment_id} not found`);
        }
        const result = this.assessmentResultRepository.create(Object.assign(Object.assign({}, createResultDto), { assessor_id: createResultDto.assessor_id || userId }));
        const savedResult = await this.assessmentResultRepository.save(result);
        await this.updateAssessmentSummary(createResultDto.assessment_id);
        return savedResult;
    }
    async getResults(assessmentId) {
        return this.assessmentResultRepository.find({
            where: { assessment_id: assessmentId },
            relations: ['unified_control', 'assessor'],
            order: { created_at: 'DESC' },
        });
    }
    async updateAssessmentSummary(assessmentId) {
        const results = await this.assessmentResultRepository.find({
            where: { assessment_id: assessmentId },
        });
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment)
            return;
        assessment.controls_assessed = results.length;
        assessment.overall_score = this.calculateOverallScore(results);
        await this.assessmentRepository.save(assessment);
    }
    calculateOverallScore(results) {
        if (results.length === 0)
            return 0;
        const scores = {
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
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = AssessmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(1, (0, typeorm_1.InjectRepository)(assessment_result_entity_1.AssessmentResult)),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map