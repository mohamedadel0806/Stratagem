import { Repository } from 'typeorm';
import { SOPSchedule } from '../entities/sop-schedule.entity';
import { CreateSOPScheduleDto, UpdateSOPScheduleDto, SOPScheduleQueryDto } from '../dto/sop-schedule.dto';
import { SOP } from '../entities/sop.entity';
export declare class SOPSchedulesService {
    private scheduleRepository;
    private sopRepository;
    private readonly logger;
    constructor(scheduleRepository: Repository<SOPSchedule>, sopRepository: Repository<SOP>);
    create(createDto: CreateSOPScheduleDto, userId: string): Promise<SOPSchedule>;
    findAll(queryDto: SOPScheduleQueryDto): Promise<{
        data: SOPSchedule[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<SOPSchedule>;
    update(id: string, updateDto: UpdateSOPScheduleDto, userId: string): Promise<SOPSchedule>;
    remove(id: string): Promise<void>;
    getSchedulesBySOP(sopId: string): Promise<SOPSchedule[]>;
    getDueSchedules(): Promise<SOPSchedule[]>;
    markAsExecuted(id: string): Promise<SOPSchedule>;
    private calculateNextExecutionDate;
    processDueSchedules(): Promise<void>;
}
