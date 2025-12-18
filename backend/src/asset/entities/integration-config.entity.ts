import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: IntegrationType,
  })
  integrationType: IntegrationType;

  @Column({ type: 'varchar', length: 500 })
  endpointUrl: string;

  @Column({
    type: 'enum',
    enum: AuthenticationType,
  })
  authenticationType: AuthenticationType;

  @Column({ type: 'text', nullable: true })
  apiKey: string; // Encrypted in production

  @Column({ type: 'text', nullable: true })
  bearerToken: string; // Encrypted in production

  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string; // For basic auth

  @Column({ type: 'text', nullable: true })
  password: string; // Encrypted in production

  @Column({ type: 'jsonb', nullable: true })
  fieldMapping: Record<string, string>; // External field -> Internal field mapping

  @Column({ type: 'varchar', length: 50, nullable: true })
  syncInterval: string; // e.g., '1h', '24h', '1d'

  @Column({
    type: 'enum',
    enum: IntegrationStatus,
    default: IntegrationStatus.INACTIVE,
  })
  status: IntegrationStatus;

  @Column({ type: 'text', nullable: true })
  lastSyncError: string;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextSyncAt: Date;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({
    type: 'enum',
    enum: ConflictResolutionStrategy,
    default: ConflictResolutionStrategy.SKIP,
    nullable: true,
  })
  conflictResolutionStrategy: ConflictResolutionStrategy;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}









