import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOPStep, StepStatus } from '../entities/sop-step.entity';
import { CreateSOPStepDto, UpdateSOPStepDto, SOPStepQueryDto } from '../dto/sop-step.dto';
import { SOP } from '../entities/sop.entity';

@Injectable()
export class SOPStepsService {
  private readonly logger = new Logger(SOPStepsService.name);

  constructor(
    @InjectRepository(SOPStep)
    private stepRepository: Repository<SOPStep>,
    @InjectRepository(SOP)
    private sopRepository: Repository<SOP>,
  ) {}

  async create(createDto: CreateSOPStepDto, userId: string): Promise<SOPStep> {
    // Verify SOP exists
    const sop = await this.sopRepository.findOne({ where: { id: createDto.sop_id } });
    if (!sop) {
      throw new NotFoundException(`SOP with ID ${createDto.sop_id} not found`);
    }

    const step = this.stepRepository.create({
      ...createDto,
      created_by: userId,
    });

    return this.stepRepository.save(step);
  }

  async findAll(queryDto: SOPStepQueryDto) {
    const { page = 1, limit = 25, sop_id, sort } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.stepRepository
      .createQueryBuilder('step')
      .leftJoinAndSelect('step.sop', 'sop')
      .leftJoinAndSelect('step.creator', 'creator')
      .leftJoinAndSelect('step.updater', 'updater');

    if (sop_id) {
      queryBuilder.andWhere('step.sop_id = :sop_id', { sop_id });
    }

    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`step.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('step.step_number', 'ASC');
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

  async findOne(id: string): Promise<SOPStep> {
    const step = await this.stepRepository.findOne({
      where: { id },
      relations: ['sop', 'creator', 'updater'],
    });

    if (!step) {
      throw new NotFoundException(`SOP step with ID ${id} not found`);
    }

    return step;
  }

  async update(id: string, updateDto: UpdateSOPStepDto, userId: string): Promise<SOPStep> {
    const step = await this.findOne(id);

    Object.assign(step, {
      ...updateDto,
      updated_by: userId,
    });

    return this.stepRepository.save(step);
  }

  async remove(id: string): Promise<void> {
    const step = await this.findOne(id);
    await this.stepRepository.softRemove(step);
  }

  async getStepsForSOP(sopId: string): Promise<SOPStep[]> {
    return this.stepRepository.find({
      where: { sop_id: sopId },
      order: { step_number: 'ASC' },
    });
  }

  async getCriticalSteps(sopId: string): Promise<SOPStep[]> {
    return this.stepRepository.find({
      where: {
        sop_id: sopId,
        is_critical: true,
      },
      order: { step_number: 'ASC' },
    });
  }

  async reorderSteps(sopId: string, stepIds: string[], userId: string): Promise<SOPStep[]> {
    // Verify all steps belong to the SOP
    const steps = await this.stepRepository.find({
      where: { sop_id: sopId },
    });

    if (steps.length !== stepIds.length) {
      throw new Error('Mismatch in step count');
    }

    // Update step numbers based on new order
    const updatedSteps: SOPStep[] = [];
    for (let i = 0; i < stepIds.length; i++) {
      const step = steps.find((s) => s.id === stepIds[i]);
      if (!step) {
        throw new NotFoundException(`Step with ID ${stepIds[i]} not found`);
      }
      step.step_number = i + 1;
      step.updated_by = userId;
      updatedSteps.push(step);
    }

    await this.stepRepository.save(updatedSteps);
    return updatedSteps;
  }

  async getTotalEstimatedDuration(sopId: string): Promise<number> {
    const steps = await this.getStepsForSOP(sopId);
    return steps.reduce((total, step) => total + (step.estimated_duration_minutes || 0), 0);
  }
}
