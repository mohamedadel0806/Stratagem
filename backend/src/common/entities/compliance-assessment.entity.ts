import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ComplianceRequirement } from './compliance-requirement.entity';
import { User } from '../../users/entities/user.entity';
import { ComplianceStatus } from './asset-requirement-mapping.entity';
import { Tenant } from './tenant.entity';

export enum AssessmentType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
}

export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

export interface ValidationResults {
  ruleId: string;
  ruleName: string;
  applicable: boolean;
  status: ComplianceStatus;
  message: string;
  details?: Record<string, any>;
}

@Entity('compliance_assessments')
@Index(['assetType', 'assetId'])
@Index(['requirementId'])
@Index(['assessedAt'])
export class ComplianceAssessment {
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
    enum: AssessmentType,
    default: AssessmentType.AUTOMATIC,
    name: 'assessment_type',
  })
  assessmentType: AssessmentType;

  @Column({
    type: 'enum',
    enum: ComplianceStatus,
    nullable: true,
    name: 'previous_status',
  })
  previousStatus: ComplianceStatus;

  @Column({
    type: 'enum',
    enum: ComplianceStatus,
    name: 'new_status',
  })
  newStatus: ComplianceStatus;

  @Column({ type: 'jsonb', nullable: true, name: 'validation_results' })
  validationResults: ValidationResults[];

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assessed_by' })
  assessedBy: User;

  @Column({ type: 'uuid', nullable: true, name: 'assessed_by' })
  assessedById: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'assessed_at' })
  assessedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
