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
import { Tenant } from '../../common/entities/tenant.entity';

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
@Index(['riskId'])
@Index(['treatmentCode'])
@Index(['status'])
@Index(['treatmentOwnerId'])
@Index(['targetCompletionDate'])
@Index(['priority'])
export class RiskTreatment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true, name: 'treatment_id' })
  treatmentCode: string;

  @Column({ type: 'uuid', name: 'risk_id' })
  riskId: string;

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
  treatmentOwnerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'treatment_owner_id' })
  treatmentOwner: User;

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
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'target_completion_date' })
  targetCompletionDate: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_completion_date' })
  actualCompletionDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'estimated_cost' })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'actual_cost' })
  actualCost: number;

  @Column({ type: 'text', nullable: true, name: 'expected_risk_reduction' })
  expectedRiskReduction: string;

  @Column({ type: 'integer', nullable: true, name: 'residual_likelihood' })
  residualLikelihood: number;

  @Column({ type: 'integer', nullable: true, name: 'residual_impact' })
  residualImpact: number;

  @Column({ type: 'integer', nullable: true, name: 'residual_risk_score' })
  residualRiskScore: number;

  @Column({ type: 'integer', default: 0, name: 'progress_percentage' })
  progressPercentage: number;

  @Column({ type: 'text', nullable: true, name: 'progress_notes' })
  progressNotes: string;

  @Column({ type: 'text', nullable: true, name: 'implementation_notes' })
  implementation_notes: string;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'linked_control_ids' })
  linkedControlIds: string[];

  @Column({ type: 'jsonb', nullable: true })
  attachments: Record<string, any>[];

  @OneToMany(() => TreatmentTask, (task) => task.treatment)
  tasks: TreatmentTask[];

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
