import { User } from '../../../users/entities/user.entity';
import { SOP } from './sop.entity';
export declare enum ScheduleFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    ANNUALLY = "annually"
}
export declare enum ScheduleStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PAUSED = "paused"
}
export declare class SOPSchedule {
    id: string;
    sop_id: string;
    sop: SOP;
    frequency: ScheduleFrequency;
    day_of_week: number | null;
    day_of_month: number | null;
    execution_time: string | null;
    status: ScheduleStatus;
    next_execution_date: Date | null;
    last_execution_date: Date | null;
    execution_count: number;
    assigned_user_ids: string[] | null;
    assigned_role_ids: string[] | null;
    reminder_template: string | null;
    reminder_days_before: number;
    send_reminders: boolean;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
