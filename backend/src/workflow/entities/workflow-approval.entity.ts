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
import { WorkflowExecution } from './workflow-execution.entity';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('workflow_approvals')
export class WorkflowApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'uuid', name: 'workflowExecutionId' })
  workflowExecutionId: string;

  @ManyToOne(() => WorkflowExecution)
  @JoinColumn({ name: 'workflowExecutionId' })
  workflowExecution: WorkflowExecution;

  @Column({ type: 'uuid', name: 'approverId' })
  approverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approverId' })
  approver: User;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  status: ApprovalStatus;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'text', nullable: true, name: 'signature_data' })
  signatureData: string; // Base64 encoded signature image

  @Column({ type: 'timestamp', nullable: true, name: 'signature_timestamp' })
  signatureTimestamp: Date;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'signature_method' })
  signatureMethod: string; // 'drawn', 'uploaded'

  @Column({ type: 'jsonb', nullable: true, name: 'signature_metadata' })
  signatureMetadata: Record<string, any>; // IP, user agent, etc.

  @Column({ type: 'int', name: 'stepOrder' })
  stepOrder: number; // For multi-step approvals

  @Column({ type: 'timestamp', nullable: true, name: 'respondedAt' })
  respondedAt: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
