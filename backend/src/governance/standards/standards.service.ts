import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, In } from 'typeorm';
import { Standard, StandardStatus } from './entities/standard.entity';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { StandardQueryDto } from './dto/standard-query.dto';
import { ControlObjective } from '../control-objectives/entities/control-objective.entity';

@Injectable()
export class StandardsService {
  private readonly logger = new Logger(StandardsService.name);

  constructor(
    @InjectRepository(Standard)
    private standardRepository: Repository<Standard>,
    @InjectRepository(ControlObjective)
    private controlObjectiveRepository: Repository<ControlObjective>,
  ) {}

  async create(createStandardDto: CreateStandardDto, userId: string): Promise<Standard> {
    const standard = this.standardRepository.create({
      ...createStandardDto,
      created_by: userId,
    });

    const savedStandard = await this.standardRepository.save(standard);

    // Link control objectives if provided
    if (createStandardDto.control_objective_ids && createStandardDto.control_objective_ids.length > 0) {
      const controlObjectives = await this.controlObjectiveRepository.find({
        where: { id: In(createStandardDto.control_objective_ids) },
      });
      savedStandard.control_objectives = controlObjectives;
      await this.standardRepository.save(savedStandard);
    }

    return savedStandard;
  }

  async findAll(queryDto: StandardQueryDto) {
    const { page = 1, limit = 25, status, policy_id, control_objective_id, owner_id, search, sort } = queryDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Standard> = {};

    if (status) {
      where.status = status;
    }

    if (policy_id) {
      where.policy_id = policy_id;
    }

    if (control_objective_id) {
      where.control_objective_id = control_objective_id;
    }

    if (owner_id) {
      where.owner_id = owner_id;
    }

    const queryBuilder = this.standardRepository
      .createQueryBuilder('standard')
      .leftJoinAndSelect('standard.owner', 'owner')
      .leftJoinAndSelect('standard.creator', 'creator')
      .leftJoinAndSelect('standard.updater', 'updater')
      .leftJoinAndSelect('standard.policy', 'policy')
      .leftJoinAndSelect('standard.control_objective', 'control_objective')
      .leftJoinAndSelect('standard.control_objectives', 'control_objectives');

    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }

    if (search) {
      queryBuilder.andWhere(
        '(standard.title ILIKE :search OR standard.description ILIKE :search OR standard.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Handle sorting
    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`standard.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('standard.created_at', 'DESC');
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

  async findOne(id: string): Promise<Standard> {
    const standard = await this.standardRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'creator',
        'updater',
        'policy',
        'control_objective',
        'control_objectives',
      ],
    });

    if (!standard) {
      throw new NotFoundException(`Standard with ID ${id} not found`);
    }

    return standard;
  }

  async update(id: string, updateStandardDto: UpdateStandardDto, userId: string): Promise<Standard> {
    const standard = await this.findOne(id);

    Object.assign(standard, {
      ...updateStandardDto,
      updated_by: userId,
    });

    // Update control objectives if provided
    if (updateStandardDto.control_objective_ids !== undefined) {
      if (updateStandardDto.control_objective_ids.length > 0) {
        const controlObjectives = await this.controlObjectiveRepository.find({
          where: { id: In(updateStandardDto.control_objective_ids) },
        });
        standard.control_objectives = controlObjectives;
      } else {
        standard.control_objectives = [];
      }
    }

    return await this.standardRepository.save(standard);
  }

  async remove(id: string): Promise<void> {
    const standard = await this.findOne(id);
    await this.standardRepository.softRemove(standard);
  }
}


