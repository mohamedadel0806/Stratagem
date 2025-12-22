import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';

export enum HookType {
  SIEM = 'siem',
  VULNERABILITY_SCANNER = 'vulnerability_scanner',
  CLOUD_MONITOR = 'cloud_monitor',
  CUSTOM = 'custom',
}

export enum HookAction {
  CREATE_EVIDENCE = 'create_evidence',
  CREATE_FINDING = 'create_finding',
  UPDATE_CONTROL_STATUS = 'update_control_status',
}

@Entity('governance_integration_hooks')
@Index(['type'])
@Index(['isActive'])
export class GovernanceIntegrationHook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: HookType,
    default: HookType.CUSTOM,
  })
  type: HookType;

  @Column({
    type: 'enum',
    enum: HookAction,
    default: HookAction.CREATE_EVIDENCE,
  })
  action: HookAction;

  @Column({ type: 'varchar', length: 128, unique: true, name: 'secret_key' })
  secretKey: string;

  @Column({ type: 'jsonb', nullable: true })
  config: {
    mapping: Record<string, string>; // Maps external fields to internal fields
    filters?: Array<{ field: string; operator: string; value: any }>;
    defaultValues?: Record<string, any>;
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => GovernanceIntegrationLog, (log) => log.hook)
  logs: GovernanceIntegrationLog[];

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}

@Entity('governance_integration_logs')
@Index(['hook_id'])
@Index(['status'])
export class GovernanceIntegrationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'hook_id' })
  hook_id: string;

  @ManyToOne(() => GovernanceIntegrationHook, (hook) => hook.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hook_id' })
  hook: GovernanceIntegrationHook;

  @Column({ type: 'varchar', length: 50 })
  status: 'success' | 'failed';

  @Column({ type: 'jsonb', nullable: true })
  payload: any;

  @Column({ type: 'jsonb', nullable: true })
  result: any;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}


