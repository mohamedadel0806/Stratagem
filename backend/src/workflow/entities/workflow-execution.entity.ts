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
import { Workflow } from './workflow.entity';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum WorkflowExecutionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('workflow_executions')
export class WorkflowExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'uuid', name: 'workflow_id' })
  workflowId: string;

  @ManyToOne(() => Workflow)
  @JoinColumn({ name: 'workflow_id' })
  workflow: Workflow;

  @Column({ type: 'varchar', length: 255, name: 'entity_type' })
  entityType: string; // 'risk', 'policy', 'compliance_requirement', etc.

  @Column({ type: 'uuid', name: 'entity_id' })
  entityId: string; // ID of the entity that triggered the workflow

  @Column({
    type: 'enum',
    enum: WorkflowExecutionStatus,
    default: WorkflowExecutionStatus.PENDING,
  })
  status: WorkflowExecutionStatus;

  @Column({ type: 'jsonb', nullable: true, name: 'input_data' })
  inputData: Record<string, any>; // Data passed to the workflow

  @Column({ type: 'jsonb', nullable: true, name: 'output_data' })
  outputData: Record<string, any>; // Results from workflow execution

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage: string;

  @Column({ type: 'uuid', nullable: true, name: 'assigned_to_id' })
  assignedToId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @Column({ type: 'timestamp', nullable: true, name: 'started_at' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
