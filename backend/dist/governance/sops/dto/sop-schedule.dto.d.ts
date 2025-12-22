import { ScheduleFrequency, ScheduleStatus } from '../entities/sop-schedule.entity';
export declare class CreateSOPScheduleDto {
    sop_id: string;
    frequency: ScheduleFrequency;
    day_of_week?: number;
    day_of_month?: number;
    execution_time?: string;
    status?: ScheduleStatus;
    assigned_user_ids?: string[];
    assigned_role_ids?: string[];
    reminder_template?: string;
    reminder_days_before?: number;
    send_reminders?: boolean;
}
export declare class UpdateSOPScheduleDto {
    frequency?: ScheduleFrequency;
    day_of_week?: number;
    day_of_month?: number;
    execution_time?: string;
    status?: ScheduleStatus;
    assigned_user_ids?: string[];
    assigned_role_ids?: string[];
    reminder_template?: string;
    reminder_days_before?: number;
    send_reminders?: boolean;
}
export declare class SOPScheduleQueryDto {
    status?: ScheduleStatus;
    frequency?: ScheduleFrequency;
    sop_id?: string;
    page?: number;
    limit?: number;
    sort?: string;
}
