import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SOPLog } from './entities/sop-log.entity';
import { CreateSOPLogDto } from './dto/create-sop-log.dto';
import { SOPLogQueryDto } from './dto/sop-log-query.dto';

@Injectable()
export class SOPLogsService {
  private readonly logger = new Logger(SOPLogsService.name);

  constructor(
    @InjectRepository(SOPLog)
    private logRepository: Repository<SOPLog>,
  ) {}

  async create(dto: CreateSOPLogDto, userId: string): Promise<SOPLog> {
    const log = this.logRepository.create({
      ...dto,
      created_by: userId,
      executor_id: dto.executor_id || userId,
    });

    return this.logRepository.save(log);
  }

  async findAll(query: SOPLogQueryDto) {
    const { page = 1, limit = 20, sop_id, executor_id, outcome, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.logRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.sop', 'sop')
      .leftJoinAndSelect('log.executor', 'executor')
      .leftJoinAndSelect('log.creator', 'creator')
      .where('log.deleted_at IS NULL');

    if (sop_id) {
      queryBuilder.andWhere('log.sop_id = :sop_id', { sop_id });
    }

    if (executor_id) {
      queryBuilder.andWhere('log.executor_id = :executor_id', { executor_id });
    }

    if (outcome) {
      queryBuilder.andWhere('log.outcome = :outcome', { outcome });
    }

    if (search) {
      queryBuilder.andWhere(
        '(sop.title ILIKE :search OR log.notes ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('log.execution_date', 'DESC')
      .addOrderBy('log.created_at', 'DESC')
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

  async findOne(id: string): Promise<SOPLog> {
    const log = await this.logRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['sop', 'executor', 'creator', 'updater'],
    });

    if (!log) {
      throw new NotFoundException(`SOP execution log with ID ${id} not found`);
    }

    return log;
  }

  async update(id: string, dto: Partial<CreateSOPLogDto>, userId: string): Promise<SOPLog> {
    const log = await this.findOne(id);

    Object.assign(log, {
      ...dto,
      updated_by: userId,
    });

    return this.logRepository.save(log);
  }

  async remove(id: string): Promise<void> {
    const log = await this.findOne(id);
    await this.logRepository.softDelete(id);
  }

  async getStatistics() {
    const stats = await this.logRepository
      .createQueryBuilder('log')
      .select('log.outcome', 'outcome')
      .addSelect('COUNT(*)', 'count')
      .where('log.deleted_at IS NULL')
      .groupBy('log.outcome')
      .getRawMany();

    return {
      byOutcome: stats,
    };
  }
}


