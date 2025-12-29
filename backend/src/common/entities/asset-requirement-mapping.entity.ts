import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { ComplianceRequirement } from './compliance-requirement.entity';
import { User } from '../../users/entities/user.entity';
import { Tenant } from './tenant.entity';

export enum ComplianceStatus {
  NOT_ASSESSED = 'not_assessed',
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PARTIALLY_COMPLIANT = 'partially_compliant',
  NOT_APPLICABLE = 'not_applicable',
  REQUIRES_REVIEW = 'requires_review',
}

export enum AssetTypeEnum {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  APPLICATION = 'application',
  SOFTWARE = 'software',
  SUPPLIER = 'supplier',
}

export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

@Entity('asset_requirement_mapping')
@Unique(['assetType', 'assetId', 'requirementId'])
@Index(['assetType', 'assetId'])
@Index(['requirementId'])
@Index(['complianceStatus'])
export class AssetRequirementMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 50, name: 'asset_type' })
  assetType: AssetType;

  @Column({ type: 'uuid', name: 'asset_id' })
  assetId: string;

  @ManyToOne(() => ComplianceRequirement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requirement_id' })
  requirement: ComplianceRequirement;

  @Column({ type: 'uuid', name: 'requirement_id' })
  requirementId: string;

  @Column({
    type: 'enum',
    enum: ComplianceStatus,
    default: ComplianceStatus.NOT_ASSESSED,
    name: 'compliance_status',
  })
  complianceStatus: ComplianceStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'last_assessed_at' })
  lastAssessedAt: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assessed_by' })
  assessedBy: User;

  @Column({ type: 'uuid', nullable: true, name: 'assessed_by' })
  assessedById: string;

  @Column({ type: 'jsonb', default: '[]', name: 'evidence_urls' })
  evidenceUrls: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: false, name: 'auto_assessed' })
  autoAssessed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
