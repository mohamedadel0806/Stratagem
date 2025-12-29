import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IntegrationConfig } from './integration-config.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum SyncStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

@Entity('integration_sync_logs')
export class IntegrationSyncLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'uuid', name: 'integration_config_id' })
  integrationConfigId: string;

  @ManyToOne(() => IntegrationConfig)
  @JoinColumn({ name: 'integration_config_id' })
  integrationConfig: IntegrationConfig;

  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.PENDING,
  })
  status: SyncStatus;

  @Column({ type: 'int', default: 0, name: 'total_records' })
  totalRecords: number;

  @Column({ type: 'int', default: 0, name: 'successful_syncs' })
  successfulSyncs: number;

  @Column({ type: 'int', default: 0, name: 'failed_syncs' })
  failedSyncs: number;

  @Column({ type: 'int', default: 0, name: 'skipped_records' })
  skippedRecords: number; // Duplicates or conflicts

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true, name: 'sync_details' })
  syncDetails: Record<string, any>; // Additional sync metadata

  @Column({ type: 'timestamp', nullable: true, name: 'started_at' })
  startedAt: Date;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;
}
