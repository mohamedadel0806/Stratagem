import { SOPSchedulesService } from '../services/sop-schedules.service';
import { CreateSOPScheduleDto, UpdateSOPScheduleDto, SOPScheduleQueryDto } from '../dto/sop-schedule.dto';
export declare class SOPSchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SOPSchedulesService);
    create(createDto: CreateSOPScheduleDto, req: any): Promise<import("../entities/sop-schedule.entity").SOPSchedule>;
    findAll(queryDto: SOPScheduleQueryDto): Promise<{
        data: import("../entities/sop-schedule.entity").SOPSchedule[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getDue(): Promise<import("../entities/sop-schedule.entity").SOPSchedule[]>;
    getBySOP(sopId: string): Promise<import("../entities/sop-schedule.entity").SOPSchedule[]>;
    findOne(id: string): Promise<import("../entities/sop-schedule.entity").SOPSchedule>;
    update(id: string, updateDto: UpdateSOPScheduleDto, req: any): Promise<import("../entities/sop-schedule.entity").SOPSchedule>;
    markExecuted(id: string): Promise<import("../entities/sop-schedule.entity").SOPSchedule>;
    remove(id: string): Promise<void>;
}
