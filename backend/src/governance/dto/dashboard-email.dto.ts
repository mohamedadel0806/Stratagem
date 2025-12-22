import { ApiProperty } from '@nestjs/swagger';
import { EmailFrequency, EmailDayOfWeek } from '../entities/dashboard-email-schedule.entity';

export class CreateDashboardEmailScheduleDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: EmailFrequency })
  frequency: EmailFrequency;

  @ApiProperty({ enum: EmailDayOfWeek, required: false })
  dayOfWeek?: EmailDayOfWeek;

  @ApiProperty({ required: false, minimum: 1, maximum: 31 })
  dayOfMonth?: number;

  @ApiProperty({ description: 'Send time in HH:MM format' })
  sendTime: string;

  @ApiProperty({ type: [String] })
  recipientEmails: string[];

  @ApiProperty({ required: false, default: true })
  isActive?: boolean;
}

export class UpdateDashboardEmailScheduleDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: EmailFrequency, required: false })
  frequency?: EmailFrequency;

  @ApiProperty({ enum: EmailDayOfWeek, required: false })
  dayOfWeek?: EmailDayOfWeek;

  @ApiProperty({ required: false, minimum: 1, maximum: 31 })
  dayOfMonth?: number;

  @ApiProperty({ required: false, description: 'Send time in HH:MM format' })
  sendTime?: string;

  @ApiProperty({ type: [String], required: false })
  recipientEmails?: string[];

  @ApiProperty({ required: false })
  isActive?: boolean;
}

export class DashboardEmailScheduleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: EmailFrequency })
  frequency: EmailFrequency;

  @ApiProperty({ enum: EmailDayOfWeek, required: false })
  dayOfWeek?: EmailDayOfWeek;

  @ApiProperty({ required: false })
  dayOfMonth?: number;

  @ApiProperty()
  sendTime: string;

  @ApiProperty({ type: [String] })
  recipientEmails: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  lastSentAt?: Date;

  @ApiProperty({ required: false })
  createdBy?: any;

  @ApiProperty({ required: false })
  updatedBy?: any;
}