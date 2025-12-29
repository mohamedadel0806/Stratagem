import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum AlertRuleTriggerType {
  TIME_BASED = 'time_based',
  THRESHOLD_BASED = 'threshold_based',
  STATUS_CHANGE = 'status_change',
  CUSTOM_CONDITION = 'custom_condition',
}

export enum AlertRuleCondition {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null',
  DAYS_OVERDUE = 'days_overdue',
  STATUS_EQUALS = 'status_equals',
}

@Entity('alert_rules')
export class AlertRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: AlertRuleTriggerType })
  triggerType: AlertRuleTriggerType;

  @Column({ type: 'varchar', length: 100 })
  entityType: string; // 'policy', 'control', 'assessment', etc.

  @Column({ type: 'varchar', length: 100, nullable: true })
  fieldName: string; // Field to check (e.g., 'reviewDate', 'status', 'effectiveness')

  @Column({ type: 'enum', enum: AlertRuleCondition })
  condition: AlertRuleCondition;

  @Column({ type: 'text', nullable: true })
  conditionValue: string; // Value to compare against

  @Column({ type: 'int', nullable: true })
  thresholdValue: number; // For numeric thresholds

  @Column({ type: 'int', default: 1 })
  severityScore: number; // 1-4 scale for severity calculation

  @Column({ type: 'varchar', length: 500, nullable: true })
  alertMessage: string; // Template for alert message

  @Column({ type: 'jsonb', nullable: true })
  filters: Record<string, any>; // Additional filters (e.g., specific frameworks, domains)

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}