import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

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

  @Column({
    type: 'enum',
    enum: ReportType,
    name: 'report_type',
  })
  reportType: ReportType;

  @Column({
    type: 'enum',
    enum: ReportFormat,
    default: ReportFormat.EXCEL,
  })
  format: ReportFormat;

  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'field_selection' })
  fieldSelection: string[]; // Selected fields to include

  @Column({ type: 'jsonb', nullable: true })
  filters: Record<string, any>; // Filter criteria

  @Column({ type: 'jsonb', nullable: true })
  grouping: Record<string, any>; // Grouping options

  @Column({ type: 'boolean', default: false, name: 'is_scheduled' })
  isScheduled: boolean;

  @Column({
    type: 'enum',
    enum: ScheduleFrequency,
    nullable: true,
    name: 'schedule_frequency',
  })
  scheduleFrequency: ScheduleFrequency;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'schedule_cron' })
  scheduleCron: string; // Custom cron expression

  @Column({ type: 'time', nullable: true, name: 'schedule_time' })
  scheduleTime: string; // Time of day to run (HH:mm format)

  @Column({ type: 'uuid', nullable: true, name: 'distribution_list_id' })
  distributionListId: string; // Email distribution list

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_system_template' })
  isSystemTemplate: boolean; // Pre-built templates that cannot be deleted

  @Column({ type: 'boolean', default: false, nullable: true, name: 'is_shared' })
  isShared?: boolean; // Whether template is shared

  @Column({ type: 'jsonb', nullable: true, name: 'shared_with_user_ids' })
  sharedWithUserIds?: string[]; // Array of user IDs who can access this template

  @Column({ type: 'jsonb', nullable: true, name: 'shared_with_team_ids' })
  sharedWithTeamIds?: string[]; // Array of team IDs who can access this template

  @Column({ type: 'boolean', default: false, nullable: true, name: 'is_organization_wide' })
  isOrganizationWide?: boolean; // Whether template is available to entire organization

  @Column({ type: 'integer', default: 1, nullable: true })
  version?: number; // Current version number

  @Column({ type: 'timestamp', nullable: true, name: 'last_run_at' })
  lastRunAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'next_run_at' })
  nextRunAt: Date;

  @Column({ type: 'uuid', name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
