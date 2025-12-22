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

export enum VersionChangeType {
  MAJOR = 'major',
  MINOR = 'minor',
  PATCH = 'patch',
}

export enum VersionStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  SUPERSEDED = 'superseded',
}

@Entity('sop_versions')
@Index(['sop_id'])
@Index(['version_number'])
@Index(['status'])
@Index(['created_by'])
export class SOPVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'sop_id' })
  sop_id: string;

  @ManyToOne(() => SOP, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sop_id' })
  sop: SOP;

  @Column({ type: 'varchar', length: 20 })
  version_number: string; // e.g., "1.0", "2.1", "3.0"

  @Column({
    type: 'varchar',
    length: 50,
    default: VersionChangeType.MINOR,
  })
  change_type: VersionChangeType;

  @Column({
    type: 'varchar',
    length: 50,
    default: VersionStatus.DRAFT,
  })
  status: VersionStatus;

  @Column({ type: 'text' })
  change_summary: string;

  @Column({ type: 'text', nullable: true })
  change_details: string;

  @Column({ type: 'jsonb', nullable: true })
  content_snapshot: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata_snapshot: Record<string, any>;

  @Column({ type: 'uuid', nullable: true, name: 'previous_version_id' })
  previous_version_id: string;

  @Column({ type: 'uuid', nullable: true, name: 'approved_by' })
  approved_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @Column({ type: 'timestamp', nullable: true, name: 'approved_at' })
  approved_at: Date;

  @Column({ type: 'text', nullable: true, name: 'approval_comments' })
  approval_comments: string;

  @Column({ type: 'uuid', nullable: true, name: 'published_by' })
  published_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'published_by' })
  publisher: User;

  @Column({ type: 'timestamp', nullable: true, name: 'published_at' })
  published_at: Date;

  @Column({ type: 'boolean', default: false, name: 'requires_retraining' })
  requires_retraining: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_backward_compatible' })
  is_backward_compatible: boolean;

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
