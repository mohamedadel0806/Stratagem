import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Alert } from './alert.entity';
import { AlertRule } from './alert-rule.entity';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum EscalationChainStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled',
}

export interface EscalationRule {
  level: number; // Escalation level (1-n)
  delayMinutes: number; // Minutes since alert creation before escalating
  roles: string[]; // Role IDs to escalate to
  workflowId?: string; // Optional workflow to trigger
  notifyChannels: ('email' | 'sms' | 'in_app')[]; // Notification channels
  description?: string;
}

@Entity('alert_escalation_chains')
export class AlertEscalationChain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'uuid', name: 'alert_id' })
  alertId: string;

  @ManyToOne(() => Alert, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'alert_id' })
  alert: Alert;

  @Column({ type: 'uuid', name: 'alert_rule_id', nullable: true })
  alertRuleId: string;

  @ManyToOne(() => AlertRule, { nullable: true })
  @JoinColumn({ name: 'alert_rule_id' })
  alertRule: AlertRule;

  @Column({ type: 'enum', enum: EscalationChainStatus, default: EscalationChainStatus.PENDING })
  status: EscalationChainStatus;

  @Column({ type: 'int', default: 0 })
  currentLevel: number; // Current escalation level

  @Column({ type: 'int' })
  maxLevels: number; // Total escalation levels

  @Column({ type: 'jsonb' })
  escalationRules: EscalationRule[]; // Array of escalation rules

  @Column({ type: 'timestamp', nullable: true })
  nextEscalationAt: Date; // When the next escalation should occur

  @Column({ type: 'jsonb', nullable: true })
  escalationHistory: Array<{
    level: number;
    escalatedAt: Date;
    escalatedToRoles: string[];
    escalatedToUsers?: string[];
    workflowTriggered?: string; // Workflow execution ID
    notificationsSent?: {
      channel: 'email' | 'sms' | 'in_app';
      recipients: string[];
      sentAt: Date;
    }[];
  }>;

  @Column({ type: 'uuid', name: 'workflow_execution_id', nullable: true })
  workflowExecutionId: string; // Current workflow execution if escalated

  @Column({ type: 'text', nullable: true })
  escalationNotes: string; // Notes about escalation

  @Column({ type: 'uuid', name: 'resolved_by_id', nullable: true })
  resolvedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'resolved_by_id' })
  resolvedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'uuid', name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
