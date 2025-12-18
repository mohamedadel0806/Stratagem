import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReportTemplate } from './report-template.entity';
import { User } from '../../users/entities/user.entity';
import { ReportType, ReportFormat, ScheduleFrequency } from './report-template.entity';

@Entity('report_template_versions')
export class ReportTemplateVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  templateId: string;

  @ManyToOne(() => ReportTemplate)
  @JoinColumn({ name: 'template_id' })
  template: ReportTemplate;

  @Column({ type: 'integer' })
  versionNumber: number;

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
  fieldSelection: string[];

  @Column({ type: 'jsonb', nullable: true })
  filters: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  grouping: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  isScheduled: boolean;

  @Column({
    type: 'enum',
    enum: ScheduleFrequency,
    nullable: true,
  })
  scheduleFrequency: ScheduleFrequency;

  @Column({ type: 'varchar', length: 50, nullable: true })
  scheduleCron: string;

  @Column({ type: 'time', nullable: true })
  scheduleTime: string;

  @Column({ type: 'uuid', nullable: true })
  distributionListId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  versionComment: string;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
