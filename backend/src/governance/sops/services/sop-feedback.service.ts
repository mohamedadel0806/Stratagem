import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SOPFeedback, FeedbackSentiment } from '../entities/sop-feedback.entity';
import { CreateSOPFeedbackDto, UpdateSOPFeedbackDto, SOPFeedbackQueryDto } from '../dto/sop-feedback.dto';
import { SOP } from '../entities/sop.entity';

@Injectable()
export class SOPFeedbackService {
  private readonly logger = new Logger(SOPFeedbackService.name);

  constructor(
    @InjectRepository(SOPFeedback)
    private feedbackRepository: Repository<SOPFeedback>,
    @InjectRepository(SOP)
    private sopRepository: Repository<SOP>,
  ) {}

  async create(createDto: CreateSOPFeedbackDto, userId: string): Promise<SOPFeedback> {
    // Verify SOP exists
    const sop = await this.sopRepository.findOne({ where: { id: createDto.sop_id } });
    if (!sop) {
      throw new NotFoundException(`SOP with ID ${createDto.sop_id} not found`);
    }

    // Auto-determine sentiment from ratings if not provided
    let sentiment = createDto.sentiment || FeedbackSentiment.NEUTRAL;
    if (!createDto.sentiment && (createDto.effectiveness_rating || createDto.clarity_rating || createDto.completeness_rating)) {
      const ratings = [
        createDto.effectiveness_rating,
        createDto.clarity_rating,
        createDto.completeness_rating,
      ].filter((r) => r !== undefined);

      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 3;

      if (avgRating >= 4.5) sentiment = FeedbackSentiment.VERY_POSITIVE;
      else if (avgRating >= 3.5) sentiment = FeedbackSentiment.POSITIVE;
      else if (avgRating >= 2.5) sentiment = FeedbackSentiment.NEUTRAL;
      else if (avgRating >= 1.5) sentiment = FeedbackSentiment.NEGATIVE;
      else sentiment = FeedbackSentiment.VERY_NEGATIVE;
    }

    const feedback = this.feedbackRepository.create({
      ...createDto,
      sentiment,
      submitted_by: userId,
      created_by: userId,
    });

    return this.feedbackRepository.save(feedback);
  }

  async findAll(queryDto: SOPFeedbackQueryDto) {
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
      queryBuilder.orderBy(`feedback.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
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

  async findOne(id: string): Promise<SOPFeedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['sop', 'submitter', 'creator', 'updater'],
    });

    if (!feedback) {
      throw new NotFoundException(`SOP feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async update(id: string, updateDto: UpdateSOPFeedbackDto, userId: string): Promise<SOPFeedback> {
    const feedback = await this.findOne(id);

    Object.assign(feedback, {
      ...updateDto,
      updated_by: userId,
    });

    return this.feedbackRepository.save(feedback);
  }

  async remove(id: string): Promise<void> {
    const feedback = await this.findOne(id);
    await this.feedbackRepository.softRemove(feedback);
  }

  async getFeedbackForSOP(sopId: string): Promise<SOPFeedback[]> {
    return this.feedbackRepository.find({
      where: { sop_id: sopId },
      relations: ['submitter'],
      order: { created_at: 'DESC' },
    });
  }

  async getSOPFeedbackMetrics(sopId: string): Promise<{
    totalFeedback: number;
    averageEffectiveness: number;
    averageClarity: number;
    averageCompleteness: number;
    sentimentDistribution: Record<FeedbackSentiment, number>;
    issuesCount: number;
    followUpRequired: number;
  }> {
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
          [FeedbackSentiment.VERY_POSITIVE]: 0,
          [FeedbackSentiment.POSITIVE]: 0,
          [FeedbackSentiment.NEUTRAL]: 0,
          [FeedbackSentiment.NEGATIVE]: 0,
          [FeedbackSentiment.VERY_NEGATIVE]: 0,
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

    const sentimentDistribution: Record<FeedbackSentiment, number> = {
      [FeedbackSentiment.VERY_POSITIVE]: 0,
      [FeedbackSentiment.POSITIVE]: 0,
      [FeedbackSentiment.NEUTRAL]: 0,
      [FeedbackSentiment.NEGATIVE]: 0,
      [FeedbackSentiment.VERY_NEGATIVE]: 0,
    };

    feedbackList.forEach((f) => {
      sentimentDistribution[f.sentiment]++;
    });

    const issuesCount = feedbackList.reduce((count, f) => count + (f.tagged_issues?.length || 0), 0);
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

  async getNegativeFeedback(): Promise<SOPFeedback[]> {
    return this.feedbackRepository.find({
      where: {
        sentiment: In([FeedbackSentiment.NEGATIVE, FeedbackSentiment.VERY_NEGATIVE]),
      },
      relations: ['sop', 'submitter'],
      order: { created_at: 'DESC' },
    });
  }

  async getFeedbackNeedingFollowUp(): Promise<SOPFeedback[]> {
    return this.feedbackRepository.find({
      where: { follow_up_required: true },
      relations: ['sop', 'submitter'],
      order: { created_at: 'DESC' },
    });
  }
}
