import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Finding } from './finding.entity';
import { User } from '../../../users/entities/user.entity';

export enum RemediationPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Entity('remediation_trackers')
@Index(['finding_id'])
@Index(['remediation_priority'])
@Index(['sla_due_date'], { where: "completion_date IS NULL" })
@Index(['assigned_to_id'])
export class RemediationTracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  finding_id: string;

  @ManyToOne(() => Finding, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'finding_id' })
  finding: Finding;

  @Column({
    type: 'enum',
    enum: RemediationPriority,
    default: RemediationPriority.MEDIUM,
    name: 'remediation_priority',
  })
  remediation_priority: RemediationPriority;

  @Column({ type: 'date', nullable: false, name: 'sla_due_date' })
  sla_due_date: Date;

  @Column({ type: 'text', nullable: true })
  remediation_steps: string;

  @Column({ type: 'uuid', nullable: true, name: 'assigned_to_id' })
  assigned_to_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assigned_to: User;

  @Column({ type: 'integer', default: 0, name: 'progress_percent' })
  progress_percent: number;

  @Column({ type: 'text', nullable: true })
  progress_notes: string;

  @Column({ type: 'date', nullable: true, name: 'completion_date' })
  completion_date: Date;

  @Column({ type: 'boolean', default: false, name: 'sla_met' })
  sla_met: boolean;

  @Column({ type: 'integer', nullable: true, name: 'days_to_completion' })
  days_to_completion: number;

  @Column({ type: 'jsonb', nullable: true })
  completion_evidence: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  completion_notes: string;

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
}
