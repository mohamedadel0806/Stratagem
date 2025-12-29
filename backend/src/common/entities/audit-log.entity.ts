import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  PUBLISH = 'PUBLISH',
  ARCHIVE = 'ARCHIVE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  VIEW = 'VIEW',
  ASSIGN = 'ASSIGN',
  COMMENT = 'COMMENT',
  STATUS_CHANGE = 'STATUS_CHANGE',
  PERMISSION_GRANT = 'PERMISSION_GRANT',
  PERMISSION_REVOKE = 'PERMISSION_REVOKE',
}

/**
 * AuditLog Entity: Immutable record of all system operations
 * Used for compliance, debugging, and forensic analysis
 */
@Entity('audit_logs')
@Index(['entityType', 'entityId'])
@Index(['userId', 'timestamp'])
@Index(['action', 'timestamp'])
@Index(['timestamp'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ type: 'varchar', length: 100 })
  entityType: string;

  @Column({ type: 'varchar', length: 36 })
  entityId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;

  /**
   * Helper method to track field changes
   */
  static trackChanges(oldValue: any, newValue: any): Record<string, any> {
    if (typeof oldValue !== 'object' || typeof newValue !== 'object') {
      return { old: oldValue, new: newValue };
    }

    const changes: Record<string, any> = {};
    const allKeys = new Set([...Object.keys(oldValue || {}), ...Object.keys(newValue || {})]);

    allKeys.forEach(key => {
      if (JSON.stringify(oldValue?.[key]) !== JSON.stringify(newValue?.[key])) {
        changes[key] = {
          old: oldValue?.[key],
          new: newValue?.[key],
        };
      }
    });

    return changes;
  }
}
