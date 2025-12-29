import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from '../../users/entities/user.entity';

export enum TenantAuditAction {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    STATUS_CHANGED = 'STATUS_CHANGED',
    SUBSCRIPTION_CHANGED = 'SUBSCRIPTION_CHANGED',
    SETTINGS_UPDATED = 'SETTINGS_UPDATED',
    USER_ADDED = 'USER_ADDED',
    USER_REMOVED = 'USER_REMOVED',
    DELETED = 'DELETED',
}

@Entity('tenant_audit_logs')
export class TenantAuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    @Index()
    tenantId: string;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({ name: 'performed_by' })
    performedBy: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'performed_by' })
    performedByUser: User;

    @Column({
        type: 'enum',
        enum: TenantAuditAction,
    })
    action: TenantAuditAction;

    @Column({ type: 'jsonb', nullable: true })
    changes: Record<string, any>;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'ip_address', nullable: true })
    ipAddress: string;

    @CreateDateColumn({ name: 'created_at' })
    @Index()
    createdAt: Date;
}
