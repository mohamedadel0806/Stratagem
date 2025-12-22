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
import { SOP, ExecutionOutcome } from './sop.entity';

@Entity('sop_logs')
@Index(['sop_id'])
@Index(['executor_id'])
@Index(['execution_date'])
@Index(['outcome'])
export class SOPLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'sop_id' })
  sop_id: string;

  @ManyToOne(() => SOP, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sop_id' })
  sop: SOP;

  @Column({ type: 'date', name: 'execution_date' })
  execution_date: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'start_time' })
  start_time: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'end_time' })
  end_time: Date;

  @Column({
    type: 'enum',
    enum: ExecutionOutcome,
    default: ExecutionOutcome.SUCCESSFUL,
  })
  outcome: ExecutionOutcome;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true, name: 'step_results' })
  step_results: Array<{ step: string; result: string; observations?: string }>;

  @Column({ type: 'uuid', nullable: true, name: 'executor_id' })
  executor_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'executor_id' })
  executor: User;

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


