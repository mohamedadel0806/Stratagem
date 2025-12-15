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

export enum InfluencerCategory {
  INTERNAL = 'internal',
  CONTRACTUAL = 'contractual',
  STATUTORY = 'statutory',
  REGULATORY = 'regulatory',
  INDUSTRY_STANDARD = 'industry_standard',
}

export enum InfluencerStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUPERSEDED = 'superseded',
  RETIRED = 'retired',
}

export enum ApplicabilityStatus {
  APPLICABLE = 'applicable',
  NOT_APPLICABLE = 'not_applicable',
  UNDER_REVIEW = 'under_review',
}

@Entity('influencers')
@Index(['category'])
@Index(['status'])
@Index(['applicability_status'])
@Index(['owner_id'])
@Index(['reference_number'])
export class Influencer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({
    type: 'enum',
    enum: InfluencerCategory,
    name: 'category',
  })
  category: InfluencerCategory;

  @Column({ type: 'varchar', length: 200, nullable: true })
  sub_category: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  issuing_authority: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  jurisdiction: string;

  @Column({ type: 'varchar', length: 200, unique: true, nullable: true })
  reference_number: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  publication_date: Date;

  @Column({ type: 'date', nullable: true })
  effective_date: Date;

  @Column({ type: 'date', nullable: true })
  last_revision_date: Date;

  @Column({ type: 'date', nullable: true })
  next_review_date: Date;

  @Column({
    type: 'enum',
    enum: InfluencerStatus,
    default: InfluencerStatus.ACTIVE,
  })
  status: InfluencerStatus;

  @Column({
    type: 'enum',
    enum: ApplicabilityStatus,
    default: ApplicabilityStatus.UNDER_REVIEW,
    name: 'applicability_status',
  })
  applicability_status: ApplicabilityStatus;

  @Column({ type: 'text', nullable: true, name: 'applicability_justification' })
  applicability_justification: string;

  @Column({ type: 'date', nullable: true, name: 'applicability_assessment_date' })
  applicability_assessment_date: Date;

  @Column({ type: 'jsonb', nullable: true, name: 'applicability_criteria' })
  applicability_criteria: Record<string, any>;

  @Column({ type: 'text', nullable: true, name: 'source_url' })
  source_url: string;

  @Column({ type: 'text', nullable: true, name: 'source_document_path' })
  source_document_path: string;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  owner_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'business_units_affected' })
  business_units_affected: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true, name: 'custom_fields' })
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




