import { Repository } from 'typeorm';
import { DashboardEmailSchedule, EmailFrequency, EmailDayOfWeek } from '../entities/dashboard-email-schedule.entity';
import { GovernanceDashboardService } from './governance-dashboard.service';
import { User } from '../../users/entities/user.entity';
export interface CreateDashboardEmailScheduleDto {
    name: string;
    description?: string;
    frequency: EmailFrequency;
    dayOfWeek?: EmailDayOfWeek;
    dayOfMonth?: number;
    sendTime: string;
    recipientEmails: string[];
    isActive?: boolean;
}
export interface UpdateDashboardEmailScheduleDto {
    name?: string;
    description?: string;
    frequency?: EmailFrequency;
    dayOfWeek?: EmailDayOfWeek;
    dayOfMonth?: number;
    sendTime?: string;
    recipientEmails?: string[];
    isActive?: boolean;
}
export declare class DashboardEmailService {
    private emailScheduleRepository;
    private userRepository;
    private dashboardService;
    private readonly logger;
    constructor(emailScheduleRepository: Repository<DashboardEmailSchedule>, userRepository: Repository<User>, dashboardService: GovernanceDashboardService);
    createSchedule(dto: CreateDashboardEmailScheduleDto, userId: string): Promise<DashboardEmailSchedule>;
    updateSchedule(id: string, dto: UpdateDashboardEmailScheduleDto, userId: string): Promise<DashboardEmailSchedule>;
    deleteSchedule(id: string): Promise<void>;
    getAllSchedules(): Promise<DashboardEmailSchedule[]>;
    getScheduleById(id: string): Promise<DashboardEmailSchedule>;
    toggleScheduleStatus(id: string, userId: string): Promise<DashboardEmailSchedule>;
    sendScheduledEmails(): Promise<void>;
    private sendDashboardEmail;
    private generateEmailContent;
    private validateScheduleConfig;
}
