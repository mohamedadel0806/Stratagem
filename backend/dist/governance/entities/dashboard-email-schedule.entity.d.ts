import { User } from '../../users/entities/user.entity';
export declare enum EmailFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export declare enum EmailDayOfWeek {
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday",
    SUNDAY = "sunday"
}
export declare class DashboardEmailSchedule {
    id: string;
    name: string;
    description: string;
    frequency: EmailFrequency;
    dayOfWeek: EmailDayOfWeek;
    dayOfMonth: number;
    sendTime: string;
    recipientEmails: string[];
    isActive: boolean;
    createdById: string;
    createdBy: User;
    updatedById: string;
    updatedBy: User;
    createdAt: Date;
    updatedAt: Date;
    lastSentAt: Date;
}
