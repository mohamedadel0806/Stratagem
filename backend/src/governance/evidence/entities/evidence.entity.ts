import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { EvidenceLinkage } from './evidence-linkage.entity';

export enum EvidenceType {
  POLICY_DOCUMENT = 'policy_document',
  CONFIGURATION_SCREENSHOT = 'configuration_screenshot',
  SYSTEM_LOG = 'system_log',
  SCAN_REPORT = 'scan_report',
  TEST_RESULT = 'test_result',
  CERTIFICATION = 'certification',
  TRAINING_RECORD = 'training_record',
  MEETING_MINUTES = 'meeting_minutes',
  EMAIL_CORRESPONDENCE = 'email_correspondence',
  CONTRACT = 'contract',
  OTHER = 'other',
}

export enum EvidenceStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

@Entity('evidence')
@Index(['evidence_identifier'])
@Index(['evidence_type'])
@Index(['status'])
@Index(['collector_id'])
@Index(['valid_until_date'])
export class Evidence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'evidence_identifier' })
  evidence_identifier: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: EvidenceType,
    name: 'evidence_type',
  })
  evidence_type: EvidenceType;

  @Column({ type: 'varchar', length: 500, nullable: true })
  filename: string;

  @Column({ type: 'text', name: 'file_path' })
  file_path: string;

  @Column({ type: 'bigint', nullable: true, name: 'file_size' })
  file_size: number;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'mime_type' })
  mime_type: string;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'file_hash' })
  file_hash: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'collection_date' })
  collection_date: Date;

  @Column({ type: 'date', nullable: true, name: 'valid_from_date' })
  valid_from_date: Date;

  @Column({ type: 'date', nullable: true, name: 'valid_until_date' })
  valid_until_date: Date;

  @Column({ type: 'uuid', nullable: true, name: 'collector_id' })
  collector_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'collector_id' })
  collector: User;

  @Column({
    type: 'enum',
    enum: EvidenceStatus,
    default: EvidenceStatus.DRAFT,
  })
  status: EvidenceStatus;

  @Column({ type: 'uuid', nullable: true, name: 'approved_by' })
  approved_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @Column({ type: 'date', nullable: true, name: 'approval_date' })
  approval_date: Date;

  @Column({ type: 'text', nullable: true, name: 'rejection_reason' })
  rejection_reason: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true, name: 'custom_metadata' })
  custom_metadata: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  confidential: boolean;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'restricted_to_roles' })
  restricted_to_roles: string[];

  @OneToMany(() => EvidenceLinkage, (linkage) => linkage.evidence)
  linkages: EvidenceLinkage[];

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}





