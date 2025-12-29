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
import { Assessment } from '../../assessments/entities/assessment.entity';
import { AssessmentResult } from '../../assessments/entities/assessment-result.entity';
import { UnifiedControl } from '../../unified-controls/entities/unified-control.entity';
import { User } from '../../../users/entities/user.entity';

export enum FindingSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'informational',
}

export enum FindingStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ACCEPTED = 'risk_accepted',
  REJECTED = 'false_positive',
}

@Entity('findings')
@Index(['finding_identifier'])
@Index(['assessment_id'])
@Index(['unified_control_id'])
@Index(['asset_type', 'asset_id'])
@Index(['severity'])
@Index(['status'])
@Index(['remediation_owner_id'])
@Index(['remediation_due_date'], { where: "status IN ('open', 'in_progress')" })
export class Finding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  tenant_id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  finding_identifier: string;

  @Column({ type: 'uuid', nullable: true })
  assessment_id: string;

  @ManyToOne(() => Assessment, { nullable: true })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @Column({ type: 'uuid', nullable: true })
  assessment_result_id: string;

  @ManyToOne(() => AssessmentResult, { nullable: true })
  @JoinColumn({ name: 'assessment_result_id' })
  assessment_result: AssessmentResult;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source_type: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  source_name: string;

  @Column({ type: 'uuid', nullable: true })
  unified_control_id: string;

  @ManyToOne(() => UnifiedControl, { nullable: true })
  @JoinColumn({ name: 'unified_control_id' })
  unified_control: UnifiedControl;

  @Column({ type: 'varchar', length: 100, nullable: true })
  asset_type: string;

  @Column({ type: 'uuid', nullable: true })
  asset_id: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: FindingSeverity,
    name: 'severity',
  })
  severity: FindingSeverity;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  finding_date: Date;

  @Column({
    type: 'enum',
    enum: FindingStatus,
    default: FindingStatus.OPEN,
    name: 'status',
  })
  status: FindingStatus;

  @Column({ type: 'uuid', nullable: true })
  remediation_owner_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'remediation_owner_id' })
  remediation_owner: User;

  @Column({ type: 'text', nullable: true })
  remediation_plan: string;

  @Column({ type: 'date', nullable: true })
  remediation_due_date: Date;

  @Column({ type: 'date', nullable: true })
  remediation_completed_date: Date;

  @Column({ type: 'jsonb', nullable: true })
  remediation_evidence: any;

  @Column({ type: 'uuid', nullable: true })
  risk_accepted_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'risk_accepted_by' })
  risk_acceptor: User;

  @Column({ type: 'text', nullable: true })
  risk_acceptance_justification: string;

  @Column({ type: 'date', nullable: true })
  risk_acceptance_date: Date;

  @Column({ type: 'date', nullable: true })
  risk_acceptance_expiry: Date;

  @Column({ type: 'boolean', default: false })
  retest_required: boolean;

  @Column({ type: 'date', nullable: true })
  retest_date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  retest_result: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}

