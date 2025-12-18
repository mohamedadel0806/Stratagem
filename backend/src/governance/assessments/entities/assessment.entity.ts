import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { AssessmentResult } from './assessment-result.entity';

export enum AssessmentType {
  IMPLEMENTATION = 'implementation',
  DESIGN_EFFECTIVENESS = 'design_effectiveness',
  OPERATING_EFFECTIVENESS = 'operating_effectiveness',
  COMPLIANCE = 'compliance',
}

export enum AssessmentStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  UNDER_REVIEW = 'under_review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('assessments')
@Index(['assessment_identifier'])
@Index(['assessment_type'])
@Index(['status'])
@Index(['lead_assessor_id'])
@Index(['start_date', 'end_date'])
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'assessment_identifier' })
  assessment_identifier: string;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AssessmentType,
    name: 'assessment_type',
  })
  assessment_type: AssessmentType;

  @Column({ type: 'text', nullable: true, name: 'scope_description' })
  scope_description: string;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'selected_control_ids' })
  selected_control_ids: string[];

  @Column({ type: 'uuid', array: true, nullable: true, name: 'selected_framework_ids' })
  selected_framework_ids: string[];

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: AssessmentStatus,
    default: AssessmentStatus.NOT_STARTED,
  })
  status: AssessmentStatus;

  @Column({ type: 'uuid', nullable: true, name: 'lead_assessor_id' })
  lead_assessor_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'lead_assessor_id' })
  lead_assessor: User;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'assessor_ids' })
  assessor_ids: string[];

  @Column({ type: 'integer', default: 0, name: 'controls_assessed' })
  controls_assessed: number;

  @Column({ type: 'integer', nullable: true, name: 'controls_total' })
  controls_total: number;

  @Column({ type: 'integer', default: 0, name: 'findings_critical' })
  findings_critical: number;

  @Column({ type: 'integer', default: 0, name: 'findings_high' })
  findings_high: number;

  @Column({ type: 'integer', default: 0, name: 'findings_medium' })
  findings_medium: number;

  @Column({ type: 'integer', default: 0, name: 'findings_low' })
  findings_low: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'overall_score' })
  overall_score: number;

  @Column({ type: 'text', nullable: true, name: 'assessment_procedures' })
  assessment_procedures: string;

  @Column({ type: 'text', nullable: true, name: 'report_path' })
  report_path: string;

  @Column({ type: 'uuid', nullable: true, name: 'approved_by' })
  approved_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @Column({ type: 'date', nullable: true, name: 'approval_date' })
  approval_date: Date;

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @OneToMany(() => AssessmentResult, (result) => result.assessment)
  results: AssessmentResult[];

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





