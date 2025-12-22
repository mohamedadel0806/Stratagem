import { DashboardEmailService, CreateDashboardEmailScheduleDto, UpdateDashboardEmailScheduleDto } from '../services/dashboard-email.service';
import { DashboardEmailSchedule } from '../entities/dashboard-email-schedule.entity';
import { CurrentUserData } from '../../auth/decorators/current-user.decorator';
export declare class DashboardEmailController {
    private readonly emailService;
    constructor(emailService: DashboardEmailService);
    createSchedule(dto: CreateDashboardEmailScheduleDto, user: CurrentUserData): Promise<DashboardEmailSchedule>;
    getAllSchedules(): Promise<DashboardEmailSchedule[]>;
    getScheduleById(id: string): Promise<DashboardEmailSchedule>;
    updateSchedule(id: string, dto: UpdateDashboardEmailScheduleDto, user: CurrentUserData): Promise<DashboardEmailSchedule>;
    deleteSchedule(id: string): Promise<void>;
    toggleScheduleStatus(id: string, user: CurrentUserData): Promise<DashboardEmailSchedule>;
    sendTestEmail(id: string): Promise<void>;
}
