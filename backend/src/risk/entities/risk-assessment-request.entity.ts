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
import { Risk } from './risk.entity';
import { RiskAssessment } from './risk-assessment.entity';
import { User } from '../../users/entities/user.entity';
import { AssessmentType } from './risk-assessment.entity';

export enum RequestPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('risk_assessment_requests')
@Index(['risk_id'])
@Index(['requested_by_id'])
@Index(['requested_for_id'])
@Index(['status'])
@Index(['assessment_type'])
@Index(['due_date'])
@Index(['request_identifier'])
export class RiskAssessmentRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'request_identifier' })
  request_identifier: string;

  @Column({ type: 'uuid', name: 'risk_id' })
  risk_id: string;

  @ManyToOne(() => Risk, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'risk_id' })
  risk: Risk;

  @Column({ type: 'uuid', name: 'requested_by_id' })
  requested_by_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requested_by_id' })
  requested_by: User;

  @Column({ type: 'uuid', nullable: true, name: 'requested_for_id' })
  requested_for_id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'requested_for_id' })
  requested_for: User;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'assessment_type',
  })
  assessment_type: AssessmentType;

  @Column({
    type: 'varchar',
    length: 20,
    default: RequestPriority.MEDIUM,
  })
  priority: RequestPriority;

  @Column({
    type: 'varchar',
    length: 50,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({ type: 'date', nullable: true, name: 'due_date' })
  due_date: Date;

  @Column({ type: 'text', nullable: true })
  justification: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true, name: 'approval_workflow_id' })
  approval_workflow_id: string;

  @Column({ type: 'uuid', nullable: true, name: 'approved_by_id' })
  approved_by_id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by_id' })
  approved_by: User;

  @Column({ type: 'timestamp', nullable: true, name: 'approved_at' })
  approved_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'rejected_by_id' })
  rejected_by_id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rejected_by_id' })
  rejected_by: User;

  @Column({ type: 'timestamp', nullable: true, name: 'rejected_at' })
  rejected_at: Date;

  @Column({ type: 'text', nullable: true, name: 'rejection_reason' })
  rejection_reason: string;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completed_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'resulting_assessment_id' })
  resulting_assessment_id: string;

  @ManyToOne(() => RiskAssessment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resulting_assessment_id' })
  resulting_assessment: RiskAssessment;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}



