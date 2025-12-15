import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IntegrationConfig } from './integration-config.entity';

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

  @Column({ type: 'uuid' })
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

  @Column({ type: 'int', default: 0 })
  totalRecords: number;

  @Column({ type: 'int', default: 0 })
  successfulSyncs: number;

  @Column({ type: 'int', default: 0 })
  failedSyncs: number;

  @Column({ type: 'int', default: 0 })
  skippedRecords: number; // Duplicates or conflicts

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  syncDetails: Record<string, any>; // Additional sync metadata

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @CreateDateColumn()
  completedAt: Date;
}








