import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Influencer } from './influencer.entity';
import { User } from '../../../users/entities/user.entity';

export enum RevisionType {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  APPLICABILITY_CHANGED = 'applicability_changed',
  REVIEWED = 'reviewed',
  ARCHIVED = 'archived',
}

@Entity('influencer_revisions')
@Index(['influencer_id'])
@Index(['revision_date'])
@Index(['revision_type'])
export class InfluencerRevision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'influencer_id' })
  influencer_id: string;

  @ManyToOne(() => Influencer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'influencer_id' })
  influencer: Influencer;

  @Column({
    type: 'enum',
    enum: RevisionType,
    name: 'revision_type',
  })
  revision_type: RevisionType;

  @Column({ type: 'text', nullable: true, name: 'revision_notes' })
  revision_notes: string;

  @Column({ type: 'date', name: 'revision_date' })
  revision_date: Date;

  @Column({ type: 'jsonb', nullable: true, name: 'changes_summary' })
  changes_summary: Record<string, { old: any; new: any }>;

  @Column({ type: 'jsonb', nullable: true, name: 'impact_assessment' })
  impact_assessment: {
    affected_policies?: string[];
    affected_controls?: string[];
    business_units_impact?: string[];
    risk_level?: 'low' | 'medium' | 'high' | 'critical';
    notes?: string;
  };

  @Column({ type: 'uuid', nullable: true, name: 'reviewed_by' })
  reviewed_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}


