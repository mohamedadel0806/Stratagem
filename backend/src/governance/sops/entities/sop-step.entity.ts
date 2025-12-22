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
import { SOP } from './sop.entity';

export enum StepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  FAILED = 'failed',
}

@Entity('sop_steps')
@Index(['sop_id'])
@Index(['step_number'])
export class SOPStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'sop_id' })
  sop_id: string;

  @ManyToOne(() => SOP, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sop_id' })
  sop: SOP;

  @Column({ type: 'integer', name: 'step_number' })
  step_number: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  expected_outcome: string;

  @Column({ type: 'text', nullable: true })
  responsible_role: string;

  @Column({ type: 'integer', nullable: true, name: 'estimated_duration_minutes' })
  estimated_duration_minutes: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  required_evidence: string[] | null;

  @Column({ type: 'boolean', default: false, name: 'is_critical' })
  is_critical: boolean;

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
