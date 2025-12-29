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
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum WorkflowType {
  APPROVAL = 'approval',
  NOTIFICATION = 'notification',
  ESCALATION = 'escalation',
  STATUS_CHANGE = 'status_change',
  DEADLINE_REMINDER = 'deadline_reminder',
}

export enum WorkflowStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum WorkflowTrigger {
  MANUAL = 'manual',
  ON_CREATE = 'on_create',
  ON_UPDATE = 'on_update',
  ON_STATUS_CHANGE = 'on_status_change',
  ON_DEADLINE_APPROACHING = 'on_deadline_approaching',
  ON_DEADLINE_PASSED = 'on_deadline_passed',
  SCHEDULED = 'scheduled',
}

export enum EntityType {
  RISK = 'risk',
  POLICY = 'policy',
  COMPLIANCE_REQUIREMENT = 'compliance_requirement',
  TASK = 'task',
  SOP = 'sop',
}

@Entity('workflows')
export class Workflow {
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

  @Column({
    type: 'enum',
    enum: WorkflowType,
  })
  type: WorkflowType;

  @Column({
    type: 'enum',
    enum: WorkflowStatus,
    default: WorkflowStatus.ACTIVE,
  })
  status: WorkflowStatus;

  @Column({
    type: 'enum',
    enum: WorkflowTrigger,
  })
  trigger: WorkflowTrigger;

  @Column({
    type: 'enum',
    enum: EntityType,
  })
  entityType: EntityType;

  @Column({ type: 'jsonb', nullable: true })
  conditions: Record<string, any>; // e.g., { status: 'draft', type: 'security' }

  @Column({ type: 'jsonb', nullable: true })
  actions: Record<string, any>; // e.g., { assignTo: 'user-id', notify: ['email'], changeStatus: 'under_review' }

  @Column({ type: 'int', nullable: true })
  daysBeforeDeadline: number; // For deadline reminders

  @Column({ type: 'uuid', nullable: true })
  organizationId: string;

  @Column({ type: 'uuid', nullable: true })
  createdById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
