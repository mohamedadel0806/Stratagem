import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOPSchedule, ScheduleStatus, ScheduleFrequency } from '../entities/sop-schedule.entity';
import { CreateSOPScheduleDto, UpdateSOPScheduleDto, SOPScheduleQueryDto } from '../dto/sop-schedule.dto';
import { SOP } from '../entities/sop.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SOPSchedulesService {
  private readonly logger = new Logger(SOPSchedulesService.name);

  constructor(
    @InjectRepository(SOPSchedule)
    private scheduleRepository: Repository<SOPSchedule>,
    @InjectRepository(SOP)
    private sopRepository: Repository<SOP>,
  ) {}

  async create(createDto: CreateSOPScheduleDto, userId: string): Promise<SOPSchedule> {
    // Verify SOP exists
    const sop = await this.sopRepository.findOne({ where: { id: createDto.sop_id } });
    if (!sop) {
      throw new NotFoundException(`SOP with ID ${createDto.sop_id} not found`);
    }

    const nextExecutionDate = this.calculateNextExecutionDate(
      createDto.frequency,
      createDto.day_of_week,
      createDto.day_of_month,
      createDto.execution_time,
    );

    const schedule = this.scheduleRepository.create({
      ...createDto,
      created_by: userId,
      next_execution_date: nextExecutionDate,
      status: createDto.status || ScheduleStatus.ACTIVE,
    });

    return this.scheduleRepository.save(schedule);
  }

  async findAll(queryDto: SOPScheduleQueryDto) {
    const { page = 1, limit = 25, status, frequency, sop_id, sort } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.sop', 'sop')
      .leftJoinAndSelect('schedule.creator', 'creator')
      .leftJoinAndSelect('schedule.updater', 'updater');

    if (status) {
      queryBuilder.andWhere('schedule.status = :status', { status });
    }

    if (frequency) {
      queryBuilder.andWhere('schedule.frequency = :frequency', { frequency });
    }

    if (sop_id) {
      queryBuilder.andWhere('schedule.sop_id = :sop_id', { sop_id });
    }

    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`schedule.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('schedule.next_execution_date', 'ASC');
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

  async findOne(id: string): Promise<SOPSchedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['sop', 'creator', 'updater'],
    });

    if (!schedule) {
      throw new NotFoundException(`SOP schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async update(id: string, updateDto: UpdateSOPScheduleDto, userId: string): Promise<SOPSchedule> {
    const schedule = await this.findOne(id);

    // Recalculate next execution date if schedule params changed
    const fieldsToCheck: (keyof UpdateSOPScheduleDto)[] = [
      'frequency',
      'day_of_week',
      'day_of_month',
      'execution_time',
    ];
    const needsRecalculation = fieldsToCheck.some(
      (field) => updateDto[field] !== undefined && updateDto[field] !== schedule[field],
    );

    Object.assign(schedule, {
      ...updateDto,
      updated_by: userId,
    });

    if (needsRecalculation) {
      schedule.next_execution_date = this.calculateNextExecutionDate(
        updateDto.frequency || schedule.frequency,
        updateDto.day_of_week ?? schedule.day_of_week,
        updateDto.day_of_month ?? schedule.day_of_month,
        updateDto.execution_time || schedule.execution_time,
      );
    }

    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.findOne(id);
    await this.scheduleRepository.softRemove(schedule);
  }

  async getSchedulesBySOP(sopId: string): Promise<SOPSchedule[]> {
    return this.scheduleRepository.find({
      where: { sop_id: sopId, status: ScheduleStatus.ACTIVE },
      relations: ['sop'],
    });
  }

  async getDueSchedules(): Promise<SOPSchedule[]> {
    const now = new Date();

    return this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.sop', 'sop')
      .where('schedule.status = :status', { status: ScheduleStatus.ACTIVE })
      .andWhere('schedule.next_execution_date <= :now', { now })
      .orderBy('schedule.next_execution_date', 'ASC')
      .getMany();
  }

  async markAsExecuted(id: string): Promise<SOPSchedule> {
    const schedule = await this.findOne(id);

    schedule.last_execution_date = new Date();
    schedule.execution_count += 1;
    schedule.next_execution_date = this.calculateNextExecutionDate(
      schedule.frequency,
      schedule.day_of_week,
      schedule.day_of_month,
      schedule.execution_time,
    );

    return this.scheduleRepository.save(schedule);
  }

  private calculateNextExecutionDate(
    frequency: ScheduleFrequency,
    dayOfWeek?: number,
    dayOfMonth?: number,
    executionTime?: string,
  ): Date {
    const now = new Date();
    const next = new Date(now);

    // Parse execution time if provided
    let hours = 0;
    let minutes = 0;
    if (executionTime) {
      const [h, m] = executionTime.split(':').map(Number);
      hours = h || 0;
      minutes = m || 0;
    }

    switch (frequency) {
      case ScheduleFrequency.DAILY:
        next.setDate(next.getDate() + 1);
        next.setHours(hours, minutes, 0, 0);
        break;

      case ScheduleFrequency.WEEKLY:
        const daysToAdd = dayOfWeek ? ((dayOfWeek - next.getDay() + 7) % 7) || 7 : 7;
        next.setDate(next.getDate() + daysToAdd);
        next.setHours(hours, minutes, 0, 0);
        break;

      case ScheduleFrequency.MONTHLY:
        const targetDay = dayOfMonth || 1;
        next.setMonth(next.getMonth() + 1);
        next.setDate(Math.min(targetDay, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
        next.setHours(hours, minutes, 0, 0);
        break;

      case ScheduleFrequency.QUARTERLY:
        next.setMonth(next.getMonth() + 3);
        next.setDate(dayOfMonth || 1);
        next.setHours(hours, minutes, 0, 0);
        break;

      case ScheduleFrequency.ANNUALLY:
        next.setFullYear(next.getFullYear() + 1);
        next.setDate(dayOfMonth || 1);
        next.setHours(hours, minutes, 0, 0);
        break;

      default:
        next.setDate(next.getDate() + 1);
    }

    return next;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processDueSchedules() {
    this.logger.debug('Processing due SOP schedules...');
    const dueSchedules = await this.getDueSchedules();
    this.logger.log(`Found ${dueSchedules.length} due SOP schedules`);
    // TODO: Send reminders and create execution logs
  }
}
