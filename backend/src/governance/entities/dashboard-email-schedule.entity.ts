import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum EmailFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum EmailDayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('dashboard_email_schedules')
export class DashboardEmailSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: EmailFrequency })
  frequency: EmailFrequency;

  @Column({ type: 'enum', enum: EmailDayOfWeek, nullable: true })
  dayOfWeek: EmailDayOfWeek; // For weekly emails

  @Column({ type: 'int', nullable: true })
  dayOfMonth: number; // For monthly emails (1-31)

  @Column({ type: 'time' })
  sendTime: string; // HH:MM format

  @Column({ type: 'simple-array' })
  recipientEmails: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid', name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ type: 'uuid', name: 'updated_by_id', nullable: true })
  updatedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'last_sent_at', nullable: true })
  lastSentAt: Date;
}