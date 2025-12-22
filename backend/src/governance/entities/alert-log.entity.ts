import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Alert } from './alert.entity';

export enum AlertLogAction {
  CREATED = 'created',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
  ESCALATED = 'escalated',
  NOTIFIED = 'notified',
}

@Entity('alert_logs')
export class AlertLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  alertId: string;

  @ManyToOne(() => Alert)
  @JoinColumn({ name: 'alert_id' })
  alert: Alert;

  @Column({ type: 'enum', enum: AlertLogAction })
  action: AlertLogAction;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: true })
  details: string; // Additional context about the action

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Additional data

  @CreateDateColumn()
  createdAt: Date;
}