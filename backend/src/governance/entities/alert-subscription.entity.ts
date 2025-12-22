import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AlertType, AlertSeverity } from './alert.entity';

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SLACK = 'slack',
}

export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

@Entity('alert_subscriptions')
@Unique(['userId', 'alertType', 'severity'])
export class AlertSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: AlertType, nullable: true })
  alertType: AlertType; // null means all types

  @Column({ type: 'enum', enum: AlertSeverity, nullable: true })
  severity: AlertSeverity; // null means all severities

  @Column({ type: 'simple-array' })
  channels: NotificationChannel[];

  @Column({ type: 'enum', enum: NotificationFrequency, default: NotificationFrequency.IMMEDIATE })
  frequency: NotificationFrequency;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  filters: Record<string, any>; // Additional filters for this subscription

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}