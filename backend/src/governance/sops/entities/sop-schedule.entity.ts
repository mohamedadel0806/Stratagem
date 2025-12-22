import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { SOP } from './sop.entity';

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

export enum ScheduleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
}

@Entity('sop_schedules')
@Index(['sop_id'])
@Index(['status'])
@Index(['next_execution_date'])
@Index(['created_by'])
export class SOPSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'sop_id' })
  sop_id: string;

  @ManyToOne(() => SOP, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sop_id' })
  sop: SOP;

  @Column({
    type: 'varchar',
    length: 50,
    default: ScheduleFrequency.MONTHLY,
  })
  frequency: ScheduleFrequency;

  @Column({ type: 'integer', nullable: true, name: 'day_of_week' })
  day_of_week: number | null; // 0-6 for weekly schedules

  @Column({ type: 'integer', nullable: true, name: 'day_of_month' })
  day_of_month: number | null; // 1-31 for monthly schedules

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'execution_time' })
  execution_time: string | null; // HH:mm format

  @Column({
    type: 'varchar',
    length: 50,
    default: ScheduleStatus.ACTIVE,
  })
  status: ScheduleStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'next_execution_date',
  })
  next_execution_date: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'last_execution_date',
  })
  last_execution_date: Date | null;

  @Column({ type: 'integer', default: 0, name: 'execution_count' })
  execution_count: number;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'assigned_user_ids' })
  assigned_user_ids: string[] | null;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'assigned_role_ids' })
  assigned_role_ids: string[] | null;

  @Column({ type: 'text', nullable: true, name: 'reminder_template' })
  reminder_template: string | null;

  @Column({ type: 'integer', default: 7, name: 'reminder_days_before' })
  reminder_days_before: number;

  @Column({ type: 'boolean', default: true, name: 'send_reminders' })
  send_reminders: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updated_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
