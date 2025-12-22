import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Risk } from './risk.entity';
import { User } from '../../users/entities/user.entity';
import { TreatmentTask } from './treatment-task.entity';

export enum TreatmentStrategy {
  MITIGATE = 'mitigate',
  TRANSFER = 'transfer',
  AVOID = 'avoid',
  ACCEPT = 'accept',
}

export enum TreatmentStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DEFERRED = 'deferred',
  CANCELLED = 'cancelled',
}

export enum TreatmentPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Entity('risk_treatments')
@Index(['risk_id'])
@Index(['treatment_id'])
@Index(['status'])
@Index(['treatment_owner_id'])
@Index(['target_completion_date'])
@Index(['priority'])
export class RiskTreatment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true, name: 'treatment_id' })
  treatment_id: string;

  @Column({ type: 'uuid', name: 'risk_id' })
  risk_id: string;

  @ManyToOne(() => Risk, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'risk_id' })
  risk: Risk;

  @Column({
    type: 'enum',
    enum: TreatmentStrategy,
  })
  strategy: TreatmentStrategy;

  @Column({ type: 'varchar', length: 300 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true, name: 'treatment_owner_id' })
  treatment_owner_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'treatment_owner_id' })
  treatment_owner: User;

  @Column({
    type: 'enum',
    enum: TreatmentStatus,
    default: TreatmentStatus.PLANNED,
  })
  status: TreatmentStatus;

  @Column({
    type: 'enum',
    enum: TreatmentPriority,
    default: TreatmentPriority.MEDIUM,
  })
  priority: TreatmentPriority;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true, name: 'target_completion_date' })
  target_completion_date: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_completion_date' })
  actual_completion_date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'estimated_cost' })
  estimated_cost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'actual_cost' })
  actual_cost: number;

  @Column({ type: 'text', nullable: true, name: 'expected_risk_reduction' })
  expected_risk_reduction: string;

  @Column({ type: 'integer', nullable: true, name: 'residual_likelihood' })
  residual_likelihood: number;

  @Column({ type: 'integer', nullable: true, name: 'residual_impact' })
  residual_impact: number;

  @Column({ type: 'integer', nullable: true, name: 'residual_risk_score' })
  residual_risk_score: number;

  @Column({ type: 'integer', default: 0, name: 'progress_percentage' })
  progress_percentage: number;

  @Column({ type: 'text', nullable: true, name: 'progress_notes' })
  progress_notes: string;

  @Column({ type: 'text', nullable: true, name: 'implementation_notes' })
  implementation_notes: string;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'linked_control_ids' })
  linked_control_ids: string[];

  @Column({ type: 'jsonb', nullable: true })
  attachments: Record<string, any>[];

  @OneToMany(() => TreatmentTask, (task) => task.treatment)
  tasks: TreatmentTask[];

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







