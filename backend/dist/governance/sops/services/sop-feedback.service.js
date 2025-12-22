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
var SOPFeedbackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOPFeedbackService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sop_feedback_entity_1 = require("../entities/sop-feedback.entity");
const sop_entity_1 = require("../entities/sop.entity");
let SOPFeedbackService = SOPFeedbackService_1 = class SOPFeedbackService {
    constructor(feedbackRepository, sopRepository) {
        this.feedbackRepository = feedbackRepository;
        this.sopRepository = sopRepository;
        this.logger = new common_1.Logger(SOPFeedbackService_1.name);
    }
    async create(createDto, userId) {
        const sop = await this.sopRepository.findOne({ where: { id: createDto.sop_id } });
        if (!sop) {
            throw new common_1.NotFoundException(`SOP with ID ${createDto.sop_id} not found`);
        }
        let sentiment = createDto.sentiment || sop_feedback_entity_1.FeedbackSentiment.NEUTRAL;
        if (!createDto.sentiment && (createDto.effectiveness_rating || createDto.clarity_rating || createDto.completeness_rating)) {
            const ratings = [
                createDto.effectiveness_rating,
                createDto.clarity_rating,
                createDto.completeness_rating,
            ].filter((r) => r !== undefined);
            const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 3;
            if (avgRating >= 4.5)
                sentiment = sop_feedback_entity_1.FeedbackSentiment.VERY_POSITIVE;
            else if (avgRating >= 3.5)
                sentiment = sop_feedback_entity_1.FeedbackSentiment.POSITIVE;
            else if (avgRating >= 2.5)
                sentiment = sop_feedback_entity_1.FeedbackSentiment.NEUTRAL;
            else if (avgRating >= 1.5)
                sentiment = sop_feedback_entity_1.FeedbackSentiment.NEGATIVE;
            else
                sentiment = sop_feedback_entity_1.FeedbackSentiment.VERY_NEGATIVE;
        }
        const feedback = this.feedbackRepository.create(Object.assign(Object.assign({}, createDto), { sentiment, submitted_by: userId, created_by: userId }));
        return this.feedbackRepository.save(feedback);
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, sop_id, sentiment, follow_up_required, sort } = queryDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.feedbackRepository
            .createQueryBuilder('feedback')
            .leftJoinAndSelect('feedback.sop', 'sop')
            .leftJoinAndSelect('feedback.submitter', 'submitter')
            .leftJoinAndSelect('feedback.creator', 'creator')
            .leftJoinAndSelect('feedback.updater', 'updater');
        if (sop_id) {
            queryBuilder.andWhere('feedback.sop_id = :sop_id', { sop_id });
        }
        if (sentiment) {
            queryBuilder.andWhere('feedback.sentiment = :sentiment', { sentiment });
        }
        if (follow_up_required !== undefined) {
            queryBuilder.andWhere('feedback.follow_up_required = :follow_up_required', { follow_up_required });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`feedback.${field}`, order.toUpperCase());
        }
        else {
            queryBuilder.orderBy('feedback.created_at', 'DESC');
        }
        const [data, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
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
        const feedback = await this.feedbackRepository.findOne({
            where: { id },
            relations: ['sop', 'submitter', 'creator', 'updater'],
        });
        if (!feedback) {
            throw new common_1.NotFoundException(`SOP feedback with ID ${id} not found`);
        }
        return feedback;
    }
    async update(id, updateDto, userId) {
        const feedback = await this.findOne(id);
        Object.assign(feedback, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        return this.feedbackRepository.save(feedback);
    }
    async remove(id) {
        const feedback = await this.findOne(id);
        await this.feedbackRepository.softRemove(feedback);
    }
    async getFeedbackForSOP(sopId) {
        return this.feedbackRepository.find({
            where: { sop_id: sopId },
            relations: ['submitter'],
            order: { created_at: 'DESC' },
        });
    }
    async getSOPFeedbackMetrics(sopId) {
        const feedbackList = await this.feedbackRepository.find({
            where: { sop_id: sopId },
        });
        const totalFeedback = feedbackList.length;
        if (totalFeedback === 0) {
            return {
                totalFeedback: 0,
                averageEffectiveness: 0,
                averageClarity: 0,
                averageCompleteness: 0,
                sentimentDistribution: {
                    [sop_feedback_entity_1.FeedbackSentiment.VERY_POSITIVE]: 0,
                    [sop_feedback_entity_1.FeedbackSentiment.POSITIVE]: 0,
                    [sop_feedback_entity_1.FeedbackSentiment.NEUTRAL]: 0,
                    [sop_feedback_entity_1.FeedbackSentiment.NEGATIVE]: 0,
                    [sop_feedback_entity_1.FeedbackSentiment.VERY_NEGATIVE]: 0,
                },
                issuesCount: 0,
                followUpRequired: 0,
            };
        }
        const effectivenessRatings = feedbackList
            .filter((f) => f.effectiveness_rating)
            .map((f) => f.effectiveness_rating);
        const clarityRatings = feedbackList.filter((f) => f.clarity_rating).map((f) => f.clarity_rating);
        const completenessRatings = feedbackList
            .filter((f) => f.completeness_rating)
            .map((f) => f.completeness_rating);
        const sentimentDistribution = {
            [sop_feedback_entity_1.FeedbackSentiment.VERY_POSITIVE]: 0,
            [sop_feedback_entity_1.FeedbackSentiment.POSITIVE]: 0,
            [sop_feedback_entity_1.FeedbackSentiment.NEUTRAL]: 0,
            [sop_feedback_entity_1.FeedbackSentiment.NEGATIVE]: 0,
            [sop_feedback_entity_1.FeedbackSentiment.VERY_NEGATIVE]: 0,
        };
        feedbackList.forEach((f) => {
            sentimentDistribution[f.sentiment]++;
        });
        const issuesCount = feedbackList.reduce((count, f) => { var _a; return count + (((_a = f.tagged_issues) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0);
        const followUpRequired = feedbackList.filter((f) => f.follow_up_required).length;
        return {
            totalFeedback,
            averageEffectiveness: effectivenessRatings.length > 0
                ? effectivenessRatings.reduce((a, b) => a + b, 0) / effectivenessRatings.length
                : 0,
            averageClarity: clarityRatings.length > 0
                ? clarityRatings.reduce((a, b) => a + b, 0) / clarityRatings.length
                : 0,
            averageCompleteness: completenessRatings.length > 0
                ? completenessRatings.reduce((a, b) => a + b, 0) / completenessRatings.length
                : 0,
            sentimentDistribution,
            issuesCount,
            followUpRequired,
        };
    }
    async getNegativeFeedback() {
        return this.feedbackRepository.find({
            where: {
                sentiment: (0, typeorm_2.In)([sop_feedback_entity_1.FeedbackSentiment.NEGATIVE, sop_feedback_entity_1.FeedbackSentiment.VERY_NEGATIVE]),
            },
            relations: ['sop', 'submitter'],
            order: { created_at: 'DESC' },
        });
    }
    async getFeedbackNeedingFollowUp() {
        return this.feedbackRepository.find({
            where: { follow_up_required: true },
            relations: ['sop', 'submitter'],
            order: { created_at: 'DESC' },
        });
    }
};
exports.SOPFeedbackService = SOPFeedbackService;
exports.SOPFeedbackService = SOPFeedbackService = SOPFeedbackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sop_feedback_entity_1.SOPFeedback)),
    __param(1, (0, typeorm_1.InjectRepository)(sop_entity_1.SOP)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SOPFeedbackService);
//# sourceMappingURL=sop-feedback.service.js.map