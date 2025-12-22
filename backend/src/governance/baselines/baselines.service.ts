import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, In } from 'typeorm';
import { SecureBaseline, BaselineRequirement, BaselineStatus } from './entities/baseline.entity';
import { CreateSecureBaselineDto, CreateBaselineRequirementDto } from './dto/create-baseline.dto';
import { BaselineQueryDto } from './dto/baseline-query.dto';
import { ControlObjective } from '../control-objectives/entities/control-objective.entity';

@Injectable()
export class BaselinesService {
  private readonly logger = new Logger(BaselinesService.name);

  constructor(
    @InjectRepository(SecureBaseline)
    private baselineRepository: Repository<SecureBaseline>,
    @InjectRepository(BaselineRequirement)
    private requirementRepository: Repository<BaselineRequirement>,
    @InjectRepository(ControlObjective)
    private controlObjectiveRepository: Repository<ControlObjective>,
  ) {}

  async create(dto: CreateSecureBaselineDto, userId: string): Promise<SecureBaseline> {
    let identifier = dto.baseline_identifier;
    if (!identifier) {
      identifier = await this.generateIdentifier();
    }

    const { requirements, control_objective_ids, ...baselineData } = dto;

    const baseline = this.baselineRepository.create({
      ...baselineData,
      baseline_identifier: identifier,
      created_by: userId,
    });

    if (control_objective_ids && control_objective_ids.length > 0) {
      baseline.control_objectives = await this.controlObjectiveRepository.find({
        where: { id: In(control_objective_ids) },
      });
    }

    const savedBaseline = await this.baselineRepository.save(baseline);

    if (requirements && requirements.length > 0) {
      const requirementEntities = requirements.map((req) =>
        this.requirementRepository.create({
          ...req,
          baseline_id: savedBaseline.id,
        }),
      );
      await this.requirementRepository.save(requirementEntities);
    }

    return this.findOne(savedBaseline.id);
  }

  async findAll(query: BaselineQueryDto) {
    const { page = 1, limit = 25, status, category, search, sort } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.baselineRepository
      .createQueryBuilder('baseline')
      .leftJoinAndSelect('baseline.owner', 'owner')
      .leftJoinAndSelect('baseline.creator', 'creator')
      .where('baseline.deleted_at IS NULL');

    if (status) {
      queryBuilder.andWhere('baseline.status = :status', { status });
    }

    if (category) {
      queryBuilder.andWhere('baseline.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(baseline.name ILIKE :search OR baseline.description ILIKE :search OR baseline.baseline_identifier ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`baseline.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('baseline.created_at', 'DESC');
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

  async findOne(id: string): Promise<SecureBaseline> {
    const baseline = await this.baselineRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['requirements', 'control_objectives', 'owner', 'creator', 'updater'],
    });

    if (!baseline) {
      throw new NotFoundException(`Secure baseline with ID ${id} not found`);
    }

    return baseline;
  }

  async update(id: string, dto: Partial<CreateSecureBaselineDto>, userId: string): Promise<SecureBaseline> {
    const baseline = await this.findOne(id);
    const { requirements, control_objective_ids, ...baselineData } = dto;

    Object.assign(baseline, {
      ...baselineData,
      updated_by: userId,
    });

    if (control_objective_ids) {
      baseline.control_objectives = await this.controlObjectiveRepository.find({
        where: { id: In(control_objective_ids) },
      });
    }

    const updatedBaseline = await this.baselineRepository.save(baseline);

    if (requirements) {
      // For simplicity in this implementation, we'll replace requirements
      await this.requirementRepository.delete({ baseline_id: id });
      const requirementEntities = requirements.map((req) =>
        this.requirementRepository.create({
          ...req,
          baseline_id: id,
        }),
      );
      await this.requirementRepository.save(requirementEntities);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const baseline = await this.findOne(id);
    await this.baselineRepository.softDelete(id);
  }

  private async generateIdentifier(): Promise<string> {
    const prefix = 'BSL';
    const year = new Date().getFullYear();
    const count = await this.baselineRepository.count({
      where: {
        baseline_identifier: Like(`${prefix}-${year}-%`),
        deleted_at: IsNull(),
      },
    });

    return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;
  }
}


