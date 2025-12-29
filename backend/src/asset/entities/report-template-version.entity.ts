import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ReportTemplate } from './report-template.entity';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';
import { ReportType, ReportFormat, ScheduleFrequency } from './report-template.entity';

@Entity('report_template_versions')
export class ReportTemplateVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'uuid', name: 'template_id' })
  templateId: string;

  @ManyToOne(() => ReportTemplate)
  @JoinColumn({ name: 'template_id' })
  template: ReportTemplate;

  @Column({ type: 'integer', name: 'version_number' })
  versionNumber: number;

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
  fieldSelection: string[];

  @Column({ type: 'jsonb', nullable: true })
  filters: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  grouping: Record<string, any>;

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
  scheduleCron: string;

  @Column({ type: 'time', nullable: true, name: 'schedule_time' })
  scheduleTime: string;

  @Column({ type: 'uuid', nullable: true, name: 'distribution_list_id' })
  distributionListId: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'text', nullable: true, name: 'version_comment' })
  versionComment: string;

  @Column({ type: 'uuid', name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
