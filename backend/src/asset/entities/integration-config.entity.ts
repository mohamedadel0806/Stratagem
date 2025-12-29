import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum IntegrationType {
  CMDB = 'cmdb',
  ASSET_MANAGEMENT_SYSTEM = 'asset_management_system',
  REST_API = 'rest_api',
  WEBHOOK = 'webhook',
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

export enum AuthenticationType {
  API_KEY = 'api_key',
  BEARER_TOKEN = 'bearer_token',
  BASIC_AUTH = 'basic_auth',
  OAUTH2 = 'oauth2',
}

export enum ConflictResolutionStrategy {
  SKIP = 'skip', // Skip duplicate records (default)
  OVERWRITE = 'overwrite', // Overwrite existing records with new data
  MERGE = 'merge', // Merge new data with existing records (prefer non-null values)
}

@Entity('integration_configs')
export class IntegrationConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: IntegrationType,
    name: 'integration_type',
  })
  integrationType: IntegrationType;

  @Column({ type: 'varchar', length: 500, name: 'endpoint_url' })
  endpointUrl: string;

  @Column({
    type: 'enum',
    enum: AuthenticationType,
    name: 'authentication_type',
  })
  authenticationType: AuthenticationType;

  @Column({ type: 'text', nullable: true, name: 'api_key' })
  apiKey: string; // Encrypted in production

  @Column({ type: 'text', nullable: true, name: 'bearer_token' })
  bearerToken: string; // Encrypted in production

  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string; // For basic auth

  @Column({ type: 'text', nullable: true })
  password: string; // Encrypted in production

  @Column({ type: 'jsonb', nullable: true, name: 'field_mapping' })
  fieldMapping: Record<string, string>; // External field -> Internal field mapping

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'sync_interval' })
  syncInterval: string; // e.g., '1h', '24h', '1d'

  @Column({
    type: 'enum',
    enum: IntegrationStatus,
    default: IntegrationStatus.INACTIVE,
  })
  status: IntegrationStatus;

  @Column({ type: 'text', nullable: true, name: 'last_sync_error' })
  lastSyncError: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_sync_at' })
  lastSyncAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'next_sync_at' })
  nextSyncAt: Date;

  @Column({ type: 'uuid', name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({
    type: 'enum',
    enum: ConflictResolutionStrategy,
    default: ConflictResolutionStrategy.SKIP,
    nullable: true,
    name: 'conflict_resolution_strategy',
  })
  conflictResolutionStrategy: ConflictResolutionStrategy;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
