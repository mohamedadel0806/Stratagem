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
import { AssetType } from './asset-type.entity';
import { BusinessUnit } from '../../common/entities/business-unit.entity';

export enum CriticalityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ConnectivityStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  UNKNOWN = 'unknown',
}

export enum NetworkApprovalStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
  NOT_REQUIRED = 'not_required',
}

@Entity('physical_assets')
@Index(['uniqueIdentifier'], { unique: true })
@Index(['ownerId'])
@Index(['businessUnitId'])
@Index(['assetTypeId'])
@Index(['criticalityLevel'])
@Index(['physicalLocation'])
@Index(['connectivityStatus'])
export class PhysicalAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Asset Type Reference (from plan: asset_type_id UUID REFERENCES asset_types(id))
  @Column({ type: 'uuid', nullable: true })
  assetTypeId: string;

  @ManyToOne(() => AssetType, { nullable: true })
  @JoinColumn({ name: 'asset_type_id' })
  assetType: AssetType;

  // Basic Information (from plan: asset_description VARCHAR(200) NOT NULL)
  @Column({ type: 'varchar', length: 200, nullable: false })
  assetDescription: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  manufacturer: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  model: string;

  @Column({ type: 'text', nullable: true })
  businessPurpose: string;

  // Ownership (from plan: owner_id UUID REFERENCES users(id))
  @Column({ type: 'uuid', nullable: true })
  ownerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  // Business Unit (from plan: business_unit_id UUID REFERENCES business_units(id))
  @Column({ type: 'uuid', nullable: true })
  businessUnitId: string;

  @ManyToOne(() => BusinessUnit, { nullable: true })
  @JoinColumn({ name: 'business_unit_id' })
  businessUnit: BusinessUnit;

  // Unique Identifier (from plan: unique_identifier VARCHAR(200) UNIQUE NOT NULL)
  @Column({ type: 'varchar', length: 200, unique: true, nullable: false })
  uniqueIdentifier: string;

  // Location (from plan: physical_location TEXT)
  @Column({ type: 'text', nullable: true })
  physicalLocation: string;

  // Criticality (from plan: criticality_level criticality_level_enum)
  @Column({
    type: 'enum',
    enum: CriticalityLevel,
    nullable: true,
  })
  criticalityLevel: CriticalityLevel;

  // Network Information (from plan: mac_addresses JSONB, ip_addresses JSONB)
  @Column({ type: 'jsonb', nullable: true })
  macAddresses: string[];

  @Column({ type: 'jsonb', nullable: true })
  ipAddresses: string[];

  // Software and Services (from plan: installed_software JSONB, active_ports_services JSONB)
  @Column({ type: 'jsonb', nullable: true })
  installedSoftware: Array<{ name: string; version: string; patch_level: string }>;

  @Column({ type: 'jsonb', nullable: true })
  activePortsServices: Array<{ port: number; service: string; protocol: string }>;

  // Approval and Connectivity (from plan)
  @Column({
    type: 'enum',
    enum: NetworkApprovalStatus,
    default: NetworkApprovalStatus.PENDING,
  })
  networkApprovalStatus: NetworkApprovalStatus;

  @Column({
    type: 'enum',
    enum: ConnectivityStatus,
    default: ConnectivityStatus.UNKNOWN,
  })
  connectivityStatus: ConnectivityStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastConnectivityCheck: Date;

  // Additional Metadata (from plan)
  @Column({ type: 'varchar', length: 200, nullable: true })
  serialNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  assetTag: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'date', nullable: true })
  warrantyExpiry: Date;

  // Compliance and Security (from plan: compliance_requirements JSONB, security_test_results JSONB)
  @Column({ type: 'jsonb', nullable: true })
  complianceRequirements: string[];

  @Column({ type: 'jsonb', nullable: true })
  securityTestResults: {
    last_test_date: Date;
    findings: string;
    severity: string;
  };

  // Audit Fields (from plan: created_by, created_at, updated_by, updated_at, deleted_at)
  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}

