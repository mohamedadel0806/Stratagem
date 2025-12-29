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
import { ControlObjective } from '../../control-objectives/entities/control-objective.entity';
import { PolicyApproval } from './policy-approval.entity';
import { PolicyVersion } from './policy-version.entity';
import { Tenant } from '../../../common/entities/tenant.entity';

export enum PolicyStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum ReviewFrequency {
  ANNUAL = 'annual',
  BIENNIAL = 'biennial',
  TRIENNIAL = 'triennial',
  QUARTERLY = 'quarterly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'as_needed',
}

@Entity('policies')
@Index(['policy_type'])
@Index(['status'])
@Index(['owner_id'])
@Index(['title', 'version_number'])
@Index(['parent_policy_id'])
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  tenant_id: string;

  @ManyToOne(() => Tenant, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 200, name: 'policy_type' })
  policy_type: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'varchar', length: 50, default: '1.0' })
  version: string;

  @Column({ type: 'integer', default: 1, name: 'version_number' })
  version_number: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ type: 'text', nullable: true })
  scope: string;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  owner_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'business_units' })
  business_units: string[];

  @Column({
    type: 'enum',
    enum: PolicyStatus,
    default: PolicyStatus.DRAFT,
  })
  status: PolicyStatus;

  @Column({ type: 'date', nullable: true, name: 'approval_date' })
  approval_date: Date;

  @Column({ type: 'date', nullable: true, name: 'effective_date' })
  effective_date: Date;

  @Column({
    type: 'enum',
    enum: ReviewFrequency,
    default: ReviewFrequency.ANNUAL,
    name: 'review_frequency',
  })
  review_frequency: ReviewFrequency;

  @Column({ type: 'date', nullable: true, name: 'next_review_date' })
  next_review_date: Date;

  @Column({ type: 'date', nullable: true, name: 'published_date' })
  published_date: Date;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'linked_influencers' })
  linked_influencers: string[];

  @Column({ type: 'uuid', nullable: true, name: 'supersedes_policy_id' })
  supersedes_policy_id: string;

  @ManyToOne(() => Policy, { nullable: true })
  @JoinColumn({ name: 'supersedes_policy_id' })
  supersedes_policy: Policy;

  // Policy Hierarchy Support (Story 2.1)
  @Column({ type: 'uuid', nullable: true, name: 'parent_policy_id' })
  parent_policy_id: string;

  @ManyToOne(() => Policy, (policy) => policy.child_policies, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_policy_id' })
  parent_policy: Policy;

  @OneToMany(() => Policy, (policy) => policy.parent_policy)
  child_policies: Policy[];

  @Column({ type: 'jsonb', nullable: true })
  attachments: Array<{ filename: string; path: string; upload_date: string; uploaded_by: string }>;

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true, name: 'custom_fields' })
  custom_fields: Record<string, any>;

  @Column({ type: 'boolean', default: true, name: 'requires_acknowledgment' })
  requires_acknowledgment: boolean;

  @Column({ type: 'integer', default: 30, name: 'acknowledgment_due_days' })
  acknowledgment_due_days: number;

  @OneToMany(() => ControlObjective, (co) => co.policy)
  control_objectives: ControlObjective[];

  @OneToMany(() => PolicyApproval, (approval) => approval.policy, {
    cascade: ['remove'],
  })
  approvals: PolicyApproval[];

  @OneToMany(() => PolicyVersion, (version) => version.policy, {
    cascade: ['remove'],
  })
  versions: PolicyVersion[];

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







