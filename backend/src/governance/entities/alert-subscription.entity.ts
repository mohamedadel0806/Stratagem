import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AlertType, AlertSeverity } from './alert.entity';
import { Tenant } from '../../common/entities/tenant.entity';

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

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'uuid', name: 'user_id' })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}