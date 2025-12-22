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

export enum FeedbackSentiment {
  VERY_POSITIVE = 'very_positive',
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  VERY_NEGATIVE = 'very_negative',
}

@Entity('sop_feedback')
@Index(['sop_id'])
@Index(['submitted_by'])
@Index(['created_at'])
@Index(['sentiment'])
export class SOPFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'sop_id' })
  sop_id: string;

  @ManyToOne(() => SOP, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sop_id' })
  sop: SOP;

  @Column({ type: 'uuid', nullable: true, name: 'submitted_by' })
  submitted_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'submitted_by' })
  submitter: User;

  @Column({
    type: 'varchar',
    length: 50,
    default: FeedbackSentiment.NEUTRAL,
  })
  sentiment: FeedbackSentiment;

  @Column({ type: 'integer', nullable: true, name: 'effectiveness_rating' })
  effectiveness_rating: number | null; // 1-5 scale

  @Column({ type: 'integer', nullable: true, name: 'clarity_rating' })
  clarity_rating: number | null; // 1-5 scale

  @Column({ type: 'integer', nullable: true, name: 'completeness_rating' })
  completeness_rating: number | null; // 1-5 scale

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'text', nullable: true, name: 'improvement_suggestions' })
  improvement_suggestions: string;

  @Column({ type: 'varchar', array: true, nullable: true, name: 'tagged_issues' })
  tagged_issues: string[] | null; // e.g., ['clarity', 'missing_steps', 'outdated']

  @Column({ type: 'boolean', default: false, name: 'follow_up_required' })
  follow_up_required: boolean;

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
