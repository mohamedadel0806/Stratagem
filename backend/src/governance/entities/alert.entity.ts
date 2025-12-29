import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export enum AlertType {
  POLICY_REVIEW_OVERDUE = 'policy_review_overdue',
  CONTROL_ASSESSMENT_PAST_DUE = 'control_assessment_past_due',
  SOP_EXECUTION_FAILURE = 'sop_execution_failure',
  AUDIT_FINDING = 'audit_finding',
  COMPLIANCE_VIOLATION = 'compliance_violation',
  RISK_THRESHOLD_EXCEEDED = 'risk_threshold_exceeded',
  CUSTOM = 'custom',
}

@Entity('alerts')
export class Alert {
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

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: AlertType })
  type: AlertType;

  @Column({ type: 'enum', enum: AlertSeverity })
  severity: AlertSeverity;

  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.ACTIVE })
  status: AlertStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Additional context data

  @Column({ type: 'uuid', nullable: true })
  relatedEntityId: string; // ID of the entity that triggered the alert

  @Column({ type: 'varchar', length: 100, nullable: true })
  relatedEntityType: string; // Type of entity (policy, control, etc.)

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ type: 'uuid', nullable: true })
  acknowledgedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'acknowledged_by_id' })
  acknowledgedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  resolvedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'resolved_by_id' })
  resolvedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'text', nullable: true })
  resolutionNotes: string;

  @Column({ type: 'uuid', nullable: true })
  escalationChainId: string; // Reference to escalation chain if escalated

  @Column({ type: 'boolean', default: false })
  hasEscalation: boolean; // Flag indicating this alert has an active escalation

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}