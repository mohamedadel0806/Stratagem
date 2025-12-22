import { EmailFrequency, EmailDayOfWeek } from '../entities/dashboard-email-schedule.entity';
export declare class CreateDashboardEmailScheduleDto {
    name: string;
    description?: string;
    frequency: EmailFrequency;
    dayOfWeek?: EmailDayOfWeek;
    dayOfMonth?: number;
    sendTime: string;
    recipientEmails: string[];
    isActive?: boolean;
}
export declare class UpdateDashboardEmailScheduleDto {
    name?: string;
    description?: string;
    frequency?: EmailFrequency;
    dayOfWeek?: EmailDayOfWeek;
    dayOfMonth?: number;
    sendTime?: string;
    recipientEmails?: string[];
    isActive?: boolean;
}
export declare class DashboardEmailScheduleDto {
    id: string;
    name: string;
    description?: string;
    frequency: EmailFrequency;
    dayOfWeek?: EmailDayOfWeek;
    dayOfMonth?: number;
    sendTime: string;
    recipientEmails: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastSentAt?: Date;
    createdBy?: any;
    updatedBy?: any;
}
