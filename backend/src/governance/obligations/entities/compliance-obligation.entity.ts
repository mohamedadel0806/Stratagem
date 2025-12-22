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
import { User } from '../../../users/entities/user.entity';
import { Influencer } from '../../influencers/entities/influencer.entity';
import { BusinessUnit } from '../../../common/entities/business-unit.entity';

export enum ObligationStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  MET = 'met',
  PARTIALLY_MET = 'partially_met',
  NOT_MET = 'not_met',
  NOT_APPLICABLE = 'not_applicable',
  OVERDUE = 'overdue',
}

export enum ObligationPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Entity('compliance_obligations')
@Index(['influencer_id'])
@Index(['owner_id'])
@Index(['business_unit_id'])
@Index(['status'])
@Index(['priority'])
export class ComplianceObligation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'obligation_identifier' })
  obligation_identifier: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', name: 'influencer_id', nullable: true })
  influencer_id: string | null;

  @ManyToOne(() => Influencer, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'influencer_id' })
  influencer: Influencer | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  source_reference: string;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  owner_id: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User | null;

  @Column({ type: 'uuid', nullable: true, name: 'business_unit_id' })
  business_unit_id: string | null;

  @ManyToOne(() => BusinessUnit, { nullable: true })
  @JoinColumn({ name: 'business_unit_id' })
  business_unit: BusinessUnit | null;

  @Column({
    type: 'enum',
    enum: ObligationStatus,
    default: ObligationStatus.NOT_STARTED,
  })
  status: ObligationStatus;

  @Column({
    type: 'enum',
    enum: ObligationPriority,
    default: ObligationPriority.MEDIUM,
  })
  priority: ObligationPriority;

  @Column({ type: 'date', nullable: true, name: 'due_date' })
  due_date: Date | null;

  @Column({ type: 'date', nullable: true, name: 'completion_date' })
  completion_date: Date | null;

  @Column({ type: 'text', nullable: true })
  evidence_summary: string;

  @Column({ type: 'jsonb', nullable: true })
  custom_fields: Record<string, any>;

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


