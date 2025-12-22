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
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { UnifiedControl } from '../../unified-controls/entities/unified-control.entity';

export enum SOPStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum SOPCategory {
  OPERATIONAL = 'operational',
  SECURITY = 'security',
  COMPLIANCE = 'compliance',
  THIRD_PARTY = 'third_party',
}

export enum ExecutionOutcome {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  PARTIALLY_COMPLETED = 'partially_completed',
}

@Entity('sops')
@Index(['sop_identifier'])
@Index(['category'])
@Index(['status'])
@Index(['owner_id'])
export class SOP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'sop_identifier' })
  sop_identifier: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: SOPCategory;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subcategory: string;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ type: 'text', nullable: true })
  scope: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string;

  @Column({ type: 'integer', default: 1, name: 'version_number' })
  version_number: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: SOPStatus.DRAFT,
  })
  status: SOPStatus;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  owner_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'review_frequency' })
  review_frequency: string;

  @Column({ type: 'date', nullable: true, name: 'next_review_date' })
  next_review_date: Date;

  @Column({ type: 'date', nullable: true, name: 'approval_date' })
  approval_date: Date;

  @Column({ type: 'date', nullable: true, name: 'published_date' })
  published_date: Date;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'linked_policies' })
  linked_policies: string[];

  @Column({ type: 'uuid', array: true, nullable: true, name: 'linked_standards' })
  linked_standards: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

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

  // Many-to-many relationship with unified controls
  @ManyToMany(() => UnifiedControl)
  @JoinTable({
    name: 'sop_control_mappings',
    joinColumn: { name: 'sop_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'unified_control_id', referencedColumnName: 'id' },
  })
  controls: UnifiedControl[];
}


