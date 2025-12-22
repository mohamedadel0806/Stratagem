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
var SOPSchedulesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOPSchedulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sop_schedule_entity_1 = require("../entities/sop-schedule.entity");
const sop_entity_1 = require("../entities/sop.entity");
const schedule_1 = require("@nestjs/schedule");
let SOPSchedulesService = SOPSchedulesService_1 = class SOPSchedulesService {
    constructor(scheduleRepository, sopRepository) {
        this.scheduleRepository = scheduleRepository;
        this.sopRepository = sopRepository;
        this.logger = new common_1.Logger(SOPSchedulesService_1.name);
    }
    async create(createDto, userId) {
        const sop = await this.sopRepository.findOne({ where: { id: createDto.sop_id } });
        if (!sop) {
            throw new common_1.NotFoundException(`SOP with ID ${createDto.sop_id} not found`);
        }
        const nextExecutionDate = this.calculateNextExecutionDate(createDto.frequency, createDto.day_of_week, createDto.day_of_month, createDto.execution_time);
        const schedule = this.scheduleRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId, next_execution_date: nextExecutionDate, status: createDto.status || sop_schedule_entity_1.ScheduleStatus.ACTIVE }));
        return this.scheduleRepository.save(schedule);
    }
    async findAll(queryDto) {
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
            queryBuilder.orderBy(`schedule.${field}`, order.toUpperCase());
        }
        else {
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
    async findOne(id) {
        const schedule = await this.scheduleRepository.findOne({
            where: { id },
            relations: ['sop', 'creator', 'updater'],
        });
        if (!schedule) {
            throw new common_1.NotFoundException(`SOP schedule with ID ${id} not found`);
        }
        return schedule;
    }
    async update(id, updateDto, userId) {
        var _a, _b;
        const schedule = await this.findOne(id);
        const fieldsToCheck = [
            'frequency',
            'day_of_week',
            'day_of_month',
            'execution_time',
        ];
        const needsRecalculation = fieldsToCheck.some((field) => updateDto[field] !== undefined && updateDto[field] !== schedule[field]);
        Object.assign(schedule, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        if (needsRecalculation) {
            schedule.next_execution_date = this.calculateNextExecutionDate(updateDto.frequency || schedule.frequency, (_a = updateDto.day_of_week) !== null && _a !== void 0 ? _a : schedule.day_of_week, (_b = updateDto.day_of_month) !== null && _b !== void 0 ? _b : schedule.day_of_month, updateDto.execution_time || schedule.execution_time);
        }
        return this.scheduleRepository.save(schedule);
    }
    async remove(id) {
        const schedule = await this.findOne(id);
        await this.scheduleRepository.softRemove(schedule);
    }
    async getSchedulesBySOP(sopId) {
        return this.scheduleRepository.find({
            where: { sop_id: sopId, status: sop_schedule_entity_1.ScheduleStatus.ACTIVE },
            relations: ['sop'],
        });
    }
    async getDueSchedules() {
        const now = new Date();
        return this.scheduleRepository
            .createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.sop', 'sop')
            .where('schedule.status = :status', { status: sop_schedule_entity_1.ScheduleStatus.ACTIVE })
            .andWhere('schedule.next_execution_date <= :now', { now })
            .orderBy('schedule.next_execution_date', 'ASC')
            .getMany();
    }
    async markAsExecuted(id) {
        const schedule = await this.findOne(id);
        schedule.last_execution_date = new Date();
        schedule.execution_count += 1;
        schedule.next_execution_date = this.calculateNextExecutionDate(schedule.frequency, schedule.day_of_week, schedule.day_of_month, schedule.execution_time);
        return this.scheduleRepository.save(schedule);
    }
    calculateNextExecutionDate(frequency, dayOfWeek, dayOfMonth, executionTime) {
        const now = new Date();
        const next = new Date(now);
        let hours = 0;
        let minutes = 0;
        if (executionTime) {
            const [h, m] = executionTime.split(':').map(Number);
            hours = h || 0;
            minutes = m || 0;
        }
        switch (frequency) {
            case sop_schedule_entity_1.ScheduleFrequency.DAILY:
                next.setDate(next.getDate() + 1);
                next.setHours(hours, minutes, 0, 0);
                break;
            case sop_schedule_entity_1.ScheduleFrequency.WEEKLY:
                const daysToAdd = dayOfWeek ? ((dayOfWeek - next.getDay() + 7) % 7) || 7 : 7;
                next.setDate(next.getDate() + daysToAdd);
                next.setHours(hours, minutes, 0, 0);
                break;
            case sop_schedule_entity_1.ScheduleFrequency.MONTHLY:
                const targetDay = dayOfMonth || 1;
                next.setMonth(next.getMonth() + 1);
                next.setDate(Math.min(targetDay, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
                next.setHours(hours, minutes, 0, 0);
                break;
            case sop_schedule_entity_1.ScheduleFrequency.QUARTERLY:
                next.setMonth(next.getMonth() + 3);
                next.setDate(dayOfMonth || 1);
                next.setHours(hours, minutes, 0, 0);
                break;
            case sop_schedule_entity_1.ScheduleFrequency.ANNUALLY:
                next.setFullYear(next.getFullYear() + 1);
                next.setDate(dayOfMonth || 1);
                next.setHours(hours, minutes, 0, 0);
                break;
            default:
                next.setDate(next.getDate() + 1);
        }
        return next;
    }
    async processDueSchedules() {
        this.logger.debug('Processing due SOP schedules...');
        const dueSchedules = await this.getDueSchedules();
        this.logger.log(`Found ${dueSchedules.length} due SOP schedules`);
    }
};
exports.SOPSchedulesService = SOPSchedulesService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SOPSchedulesService.prototype, "processDueSchedules", null);
exports.SOPSchedulesService = SOPSchedulesService = SOPSchedulesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sop_schedule_entity_1.SOPSchedule)),
    __param(1, (0, typeorm_1.InjectRepository)(sop_entity_1.SOP)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SOPSchedulesService);
//# sourceMappingURL=sop-schedules.service.js.map