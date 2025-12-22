import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReportType {
  ASSET_INVENTORY = 'asset_inventory',
  COMPLIANCE_REPORT = 'compliance_report',
  SECURITY_TEST_REPORT = 'security_test_report',
  SOFTWARE_INVENTORY = 'software_inventory',
  CONTRACT_EXPIRATION = 'contract_expiration',
  SUPPLIER_CRITICALITY = 'supplier_criticality',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  EXCEL = 'excel',
  PDF = 'pdf',
  CSV = 'csv',
}

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity('report_templates')
export class ReportTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  reportType: ReportType;

  @Column({
    type: 'enum',
    enum: ReportFormat,
    default: ReportFormat.EXCEL,
  })
  format: ReportFormat;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  fieldSelection: string[]; // Selected fields to include

  @Column({ type: 'jsonb', nullable: true })
  filters: Record<string, any>; // Filter criteria

  @Column({ type: 'jsonb', nullable: true })
  grouping: Record<string, any>; // Grouping options

  @Column({ type: 'boolean', default: false })
  isScheduled: boolean;

  @Column({
    type: 'enum',
    enum: ScheduleFrequency,
    nullable: true,
  })
  scheduleFrequency: ScheduleFrequency;

  @Column({ type: 'varchar', length: 50, nullable: true })
  scheduleCron: string; // Custom cron expression

  @Column({ type: 'time', nullable: true })
  scheduleTime: string; // Time of day to run (HH:mm format)

  @Column({ type: 'uuid', nullable: true })
  distributionListId: string; // Email distribution list

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isSystemTemplate: boolean; // Pre-built templates that cannot be deleted

  @Column({ type: 'boolean', default: false, nullable: true })
  isShared?: boolean; // Whether template is shared

  @Column({ type: 'jsonb', nullable: true })
  sharedWithUserIds?: string[]; // Array of user IDs who can access this template

  @Column({ type: 'jsonb', nullable: true })
  sharedWithTeamIds?: string[]; // Array of team IDs who can access this template

  @Column({ type: 'boolean', default: false, nullable: true })
  isOrganizationWide?: boolean; // Whether template is available to entire organization

  @Column({ type: 'integer', default: 1, nullable: true })
  version?: number; // Current version number

  @Column({ type: 'timestamp', nullable: true })
  lastRunAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextRunAt: Date;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



