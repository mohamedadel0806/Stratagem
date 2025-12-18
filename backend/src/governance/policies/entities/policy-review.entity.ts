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
import { Policy } from './policy.entity';
import { User } from '../../../users/entities/user.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DEFERRED = 'deferred',
  CANCELLED = 'cancelled',
}

export enum ReviewOutcome {
  APPROVED = 'approved',
  REQUIRES_CHANGES = 'requires_changes',
  SUPERSEDED = 'superseded',
  ARCHIVED = 'archived',
  NO_CHANGES = 'no_changes',
}

@Entity('policy_reviews')
@Index(['policy_id'])
@Index(['reviewer_id'])
@Index(['status'])
@Index(['review_date'])
export class PolicyReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'policy_id' })
  policy_id: string;

  @ManyToOne(() => Policy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'date', name: 'review_date' })
  review_date: Date;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus;

  @Column({
    type: 'enum',
    enum: ReviewOutcome,
    nullable: true,
  })
  outcome: ReviewOutcome | null;

  @Column({ type: 'uuid', nullable: true, name: 'reviewer_id' })
  reviewer_id: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'text', nullable: true, name: 'review_summary' })
  review_summary: string | null;

  @Column({ type: 'text', nullable: true, name: 'recommended_changes' })
  recommended_changes: string | null;

  @Column({ type: 'date', nullable: true, name: 'next_review_date' })
  next_review_date: Date | null;

  @Column({ type: 'date', nullable: true, name: 'completed_at' })
  completed_at: Date | null;

  @Column({ type: 'uuid', nullable: true, name: 'initiated_by' })
  initiated_by: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'initiated_by' })
  initiator: User | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
