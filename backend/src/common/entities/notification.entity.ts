import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  WORKFLOW_APPROVAL_REQUIRED = 'workflow_approval_required',
  WORKFLOW_APPROVED = 'workflow_approved',
  WORKFLOW_REJECTED = 'workflow_rejected',
  WORKFLOW_COMPLETED = 'workflow_completed',
  TASK_ASSIGNED = 'task_assigned',
  TASK_DUE_SOON = 'task_due_soon',
  DEADLINE_APPROACHING = 'deadline_approaching',
  DEADLINE_PASSED = 'deadline_passed',
  RISK_ESCALATED = 'risk_escalated',
  POLICY_REVIEW_REQUIRED = 'policy_review_required',
  GENERAL = 'general',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'userId' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.GENERAL,
    name: 'type',
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
    name: 'priority',
  })
  priority: NotificationPriority;

  @Column({ type: 'varchar', length: 255, name: 'title' })
  title: string;

  @Column({ type: 'text', name: 'message' })
  message: string;

  @Column({ type: 'boolean', default: false, name: 'isRead' })
  isRead: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'entityType' })
  entityType: string;

  @Column({ type: 'uuid', nullable: true, name: 'entityId' })
  entityId: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'actionUrl' })
  actionUrl: string;

  @Column({ type: 'jsonb', nullable: true, name: 'metadata' })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'readAt' })
  readAt: Date;
}





