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
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ComplianceFramework } from '../../common/entities/compliance-framework.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum FrameworkType {
  ISO27001 = 'iso27001',
  NIST_CYBERSECURITY = 'nist_cybersecurity',
  NIST_PRIVACY = 'nist_privacy',
  PCI_DSS = 'pci_dss',
  GDPR = 'gdpr',
  NCA_ECC = 'nca_ecc', // UAE NCA Essential Cyber Controls
  SOC2 = 'soc2',
  HIPAA = 'hipaa',
  CUSTOM = 'custom',
}

@Entity('governance_framework_configs')
@Index(['framework_type'])
@Index(['is_active'])
@Index(['created_by'])
@Index(['linked_framework_id'])
export class GovernanceFrameworkConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  name: string; // e.g., "UAE NCA Compliance Framework"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: FrameworkType,
    default: FrameworkType.CUSTOM,
  })
  framework_type: FrameworkType;

  @Column({ type: 'text', nullable: true })
  scope: string; // "All departments", "Finance & IT", etc.

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'linked_framework_id' })
  linked_framework_id: string; // Reference to ComplianceFramework for structure

  @ManyToOne(() => ComplianceFramework, { nullable: true })
  @JoinColumn({ name: 'linked_framework_id' })
  linked_framework: ComplianceFramework;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    // Configuration options
    require_policy_approval?: boolean;
    require_control_testing?: boolean;
    policy_review_frequency?: string; // 'annual', 'bi-annual', 'quarterly'
    control_review_frequency?: string;
    risk_assessment_required?: boolean;
    audit_required?: boolean;
    integration_points?: string[]; // e.g., ['audit', 'risk', 'compliance']
  };

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
