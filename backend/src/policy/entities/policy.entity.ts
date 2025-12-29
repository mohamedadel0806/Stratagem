import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from '../../common/entities/tenant.entity';

export enum PolicyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  UNDER_REVIEW = 'under_review',
  ARCHIVED = 'archived',
}

export enum PolicyType {
  SECURITY = 'security',
  COMPLIANCE = 'compliance',
  OPERATIONAL = 'operational',
  IT = 'it',
  HR = 'hr',
  FINANCE = 'finance',
}

@Entity('policies')
@Index(['policyType'])
@Index(['status'])
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PolicyType,
    default: PolicyType.COMPLIANCE,
    name: 'policy_type',
  })
  policyType: PolicyType;

  @Column({
    type: 'enum',
    enum: PolicyStatus,
    default: PolicyStatus.DRAFT,
    name: 'status',
  })
  status: PolicyStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  ownerId: string;

  @Column({ type: 'timestamp', nullable: true, name: 'effective_date' })
  effectiveDate: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'review_date' })
  reviewDate: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'document_url' })
  documentUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'document_name' })
  documentName: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'document_mime_type' })
  documentMimeType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Legacy field
  @Column({ type: 'uuid', nullable: true, name: 'organization_id' })
  organizationId: string;
}
