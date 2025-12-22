import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ScheduleFrequency, ScheduleStatus } from '../entities/sop-schedule.entity';

export class CreateSOPScheduleDto {
  @IsUUID()
  sop_id: string;

  @IsEnum(ScheduleFrequency)
  frequency: ScheduleFrequency;

  @IsOptional()
  @IsNumber()
  day_of_week?: number;

  @IsOptional()
  @IsNumber()
  day_of_month?: number;

  @IsOptional()
  @IsString()
  execution_time?: string; // HH:mm format

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assigned_user_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assigned_role_ids?: string[];

  @IsOptional()
  @IsString()
  reminder_template?: string;

  @IsOptional()
  @IsNumber()
  reminder_days_before?: number;

  @IsOptional()
  @IsBoolean()
  send_reminders?: boolean;
}

export class UpdateSOPScheduleDto {
  @IsOptional()
  @IsEnum(ScheduleFrequency)
  frequency?: ScheduleFrequency;

  @IsOptional()
  @IsNumber()
  day_of_week?: number;

  @IsOptional()
  @IsNumber()
  day_of_month?: number;

  @IsOptional()
  @IsString()
  execution_time?: string;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assigned_user_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assigned_role_ids?: string[];

  @IsOptional()
  @IsString()
  reminder_template?: string;

  @IsOptional()
  @IsNumber()
  reminder_days_before?: number;

  @IsOptional()
  @IsBoolean()
  send_reminders?: boolean;
}

export class SOPScheduleQueryDto {
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @IsOptional()
  @IsEnum(ScheduleFrequency)
  frequency?: ScheduleFrequency;

  @IsOptional()
  @IsUUID()
  sop_id?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  sort?: string;
}
