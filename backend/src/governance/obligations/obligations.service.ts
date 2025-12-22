import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, ILike } from 'typeorm';
import { ComplianceObligation, ObligationStatus } from './entities/compliance-obligation.entity';
import { CreateComplianceObligationDto } from './dto/create-obligation.dto';
import { ObligationQueryDto } from './dto/obligation-query.dto';

@Injectable()
export class ObligationsService {
  private readonly logger = new Logger(ObligationsService.name);

  constructor(
    @InjectRepository(ComplianceObligation)
    private obligationRepository: Repository<ComplianceObligation>,
  ) {}

  async create(dto: CreateComplianceObligationDto, userId: string): Promise<ComplianceObligation> {
    let identifier = dto.obligation_identifier;
    if (!identifier) {
      identifier = await this.generateIdentifier();
    }

    const obligation = this.obligationRepository.create({
      ...dto,
      obligation_identifier: identifier,
      created_by: userId,
    });

    return this.obligationRepository.save(obligation);
  }

  async findAll(query: ObligationQueryDto) {
    const { page = 1, limit = 25, status, priority, influencer_id, owner_id, business_unit_id, search, sort } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.obligationRepository
      .createQueryBuilder('obligation')
      .leftJoinAndSelect('obligation.influencer', 'influencer')
      .leftJoinAndSelect('obligation.owner', 'owner')
      .leftJoinAndSelect('obligation.business_unit', 'business_unit')
      .leftJoinAndSelect('obligation.creator', 'creator')
      .where('obligation.deleted_at IS NULL');

    if (status) {
      queryBuilder.andWhere('obligation.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('obligation.priority = :priority', { priority });
    }

    if (influencer_id) {
      queryBuilder.andWhere('obligation.influencer_id = :influencer_id', { influencer_id });
    }

    if (owner_id) {
      queryBuilder.andWhere('obligation.owner_id = :owner_id', { owner_id });
    }

    if (business_unit_id) {
      queryBuilder.andWhere('obligation.business_unit_id = :business_unit_id', { business_unit_id });
    }

    if (search) {
      queryBuilder.andWhere(
        '(obligation.title ILIKE :search OR obligation.description ILIKE :search OR obligation.obligation_identifier ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`obligation.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('obligation.created_at', 'DESC');
    }

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

  async findOne(id: string): Promise<ComplianceObligation> {
    const obligation = await this.obligationRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['influencer', 'owner', 'business_unit', 'creator', 'updater'],
    });

    if (!obligation) {
      throw new NotFoundException(`Obligation with ID ${id} not found`);
    }

    return obligation;
  }

  async update(id: string, dto: Partial<CreateComplianceObligationDto>, userId: string): Promise<ComplianceObligation> {
    const obligation = await this.findOne(id);

    if (dto.status === ObligationStatus.MET && obligation.status !== ObligationStatus.MET) {
      obligation.completion_date = new Date();
    }

    Object.assign(obligation, {
      ...dto,
      updated_by: userId,
    });

    return this.obligationRepository.save(obligation);
  }

  async remove(id: string): Promise<void> {
    const obligation = await this.findOne(id);
    await this.obligationRepository.softDelete(id);
  }

  async getStatistics() {
    const stats = await this.obligationRepository
      .createQueryBuilder('obligation')
      .select('obligation.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('obligation.deleted_at IS NULL')
      .groupBy('obligation.status')
      .getRawMany();

    const priorityStats = await this.obligationRepository
      .createQueryBuilder('obligation')
      .select('obligation.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .where('obligation.deleted_at IS NULL')
      .groupBy('obligation.priority')
      .getRawMany();

    return {
      byStatus: stats,
      byPriority: priorityStats,
    };
  }

  private async generateIdentifier(): Promise<string> {
    const prefix = 'OBL';
    const year = new Date().getFullYear();
    const count = await this.obligationRepository.count({
      where: {
        obligation_identifier: Like(`${prefix}-${year}-%`),
        deleted_at: IsNull(),
      },
    });

    return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;
  }
}


