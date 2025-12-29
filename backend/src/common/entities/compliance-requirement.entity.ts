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
import { ComplianceFramework } from './compliance-framework.entity';
import { Tenant } from './tenant.entity';

export enum RequirementStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PARTIALLY_COMPLIANT = 'partially_compliant',
}

@Entity('compliance_requirements')
export class ComplianceRequirement {
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

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'requirement_code' })
  requirementCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'category' })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'compliance_deadline' })
  complianceDeadline: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'applicability' })
  applicability: string;

  @ManyToOne(() => ComplianceFramework, (framework) => framework.requirements)
  @JoinColumn({ name: 'framework_id' })
  framework: ComplianceFramework;

  @Column({ type: 'uuid', name: 'framework_id' })
  frameworkId: string;

  @Column({
    type: 'enum',
    enum: RequirementStatus,
    default: RequirementStatus.NOT_STARTED,
  })
  status: RequirementStatus;

  @Column({ type: 'uuid', nullable: true, name: 'organization_id' })
  organizationId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
