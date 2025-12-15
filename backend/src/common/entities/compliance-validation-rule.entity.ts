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
import { ComplianceRequirement } from './compliance-requirement.entity';
import { User } from '../../users/entities/user.entity';

export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

export interface ValidationLogic {
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'exists' | 'not_exists';
    value: any;
  }>;
  complianceCriteria: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  nonComplianceCriteria?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  partialComplianceCriteria?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
}

@Entity('compliance_validation_rules')
@Index(['requirementId'])
@Index(['assetType'])
@Index(['isActive'])
export class ComplianceValidationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ComplianceRequirement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requirement_id' })
  requirement: ComplianceRequirement;

  @Column({ type: 'uuid', name: 'requirement_id' })
  requirementId: string;

  @Column({ type: 'varchar', length: 50, name: 'asset_type' })
  assetType: AssetType;

  @Column({ type: 'varchar', length: 255, name: 'rule_name' })
  ruleName: string;

  @Column({ type: 'text', nullable: true, name: 'rule_description' })
  ruleDescription: string;

  @Column({ type: 'jsonb', name: 'validation_logic' })
  validationLogic: ValidationLogic;

  @Column({ type: 'integer', default: 0 })
  priority: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  createdById: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

