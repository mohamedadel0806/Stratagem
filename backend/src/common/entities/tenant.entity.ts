import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from 'typeorm';
import { SmtpConfig, NotificationBranding } from '../interfaces/notification-settings.interface';

export enum TenantStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    TRIAL = 'trial',
    DELETED = 'deleted',
}

export enum SubscriptionTier {
    STARTER = 'starter',
    PROFESSIONAL = 'professional',
    ENTERPRISE = 'enterprise',
}

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    name: string;

    @Column({ unique: true })
    @Index()
    code: string;

    @Column({
        type: 'enum',
        enum: TenantStatus,
        default: TenantStatus.TRIAL,
    })
    status: TenantStatus;

    @Column({
        name: 'subscription_tier',
        type: 'enum',
        enum: SubscriptionTier,
        default: SubscriptionTier.STARTER,
    })
    subscriptionTier: SubscriptionTier;

    @Column({ type: 'jsonb', nullable: true })
    settings: Record<string, any>;

    @Column({ nullable: true })
    industry: string;

    @Column({ name: 'regulatory_scope', type: 'text', nullable: true })
    regulatoryScope: string;

    @Column({ name: 'suspension_reason', type: 'text', nullable: true })
    suspensionReason: string;

    @Column({ name: 'last_activity_at', type: 'timestamp', nullable: true })
    lastActivityAt: Date;

    @Column({ name: 'user_count', type: 'integer', default: 0 })
    userCount: number;

    @Column({ name: 'storage_used_mb', type: 'integer', default: 0 })
    storageUsedMB: number;

    @Column({ name: 'trial_started_at', type: 'timestamp', nullable: true })
    trialStartedAt: Date;

    @Column({ name: 'trial_ends_at', type: 'timestamp', nullable: true })
    trialEndsAt: Date;

    @Column({ name: 'onboarding_progress', type: 'jsonb', nullable: true })
    onboardingProgress: Record<string, any>;

    @Column({ name: 'allowed_domains', type: 'text', array: true, default: '{}' })
    allowedDomains: string[];

    @Column({ name: 'smtp_config', type: 'jsonb', nullable: true })
    smtpConfig: SmtpConfig;

    @Column({ name: 'notification_branding', type: 'jsonb', nullable: true })
    notificationBranding: NotificationBranding;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
