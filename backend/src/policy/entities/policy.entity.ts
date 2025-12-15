import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PolicyType,
    default: PolicyType.COMPLIANCE,
    name: 'policyType',
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

  @Column({ type: 'uuid', nullable: true, name: 'organizationId' })
  organizationId: string;

  @Column({ type: 'uuid', nullable: true, name: 'ownerId' })
  ownerId: string;

  @Column({ type: 'timestamp', nullable: true, name: 'effectiveDate' })
  effectiveDate: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'reviewDate' })
  reviewDate: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'documentUrl' })
  documentUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'documentName' })
  documentName: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'documentMimeType' })
  documentMimeType: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

