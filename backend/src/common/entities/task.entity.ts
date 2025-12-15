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

export enum TaskPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskType {
  POLICY_REVIEW = 'policy_review',
  RISK_MITIGATION = 'risk_mitigation',
  COMPLIANCE_REQUIREMENT = 'compliance_requirement',
  AUDIT = 'audit',
  VENDOR_ASSESSMENT = 'vendor_assessment',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.COMPLIANCE_REQUIREMENT,
    name: 'taskType',
  })
  taskType: TaskType;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    name: 'priority',
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    name: 'status',
  })
  status: TaskStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'dueDate' })
  dueDate: Date;

  @Column({ type: 'uuid', nullable: true, name: 'assignedToId' })
  assignedToId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'relatedEntityType' })
  relatedEntityType: string;

  @Column({ type: 'uuid', nullable: true, name: 'relatedEntityId' })
  relatedEntityId: string;

  @Column({ type: 'uuid', nullable: true, name: 'organizationId' })
  organizationId: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

