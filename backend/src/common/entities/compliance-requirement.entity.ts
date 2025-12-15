import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ComplianceFramework } from './compliance-framework.entity';

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

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'requirementCode' })
  requirementCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'category' })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'complianceDeadline' })
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

  @Column({ type: 'uuid', nullable: true, name: 'organizationId' })
  organizationId: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

