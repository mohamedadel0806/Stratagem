import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AssetType } from './asset-type.entity';
import { BusinessUnit } from '../../common/entities/business-unit.entity';
import { Tenant } from '../../common/entities/tenant.entity';

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

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  // Asset Type Reference (from plan: asset_type_id UUID REFERENCES asset_types(id))
  @Column({ type: 'uuid', nullable: true, name: 'asset_type_id' })
  assetTypeId: string;

  @ManyToOne(() => AssetType, { nullable: true })
  @JoinColumn({ name: 'asset_type_id' })
  assetType: AssetType;

  // Basic Information (from plan: asset_description VARCHAR(200) NOT NULL)
  @Column({ type: 'varchar', length: 200, nullable: false, name: 'asset_description' })
  assetDescription: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  manufacturer: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  model: string;

  @Column({ type: 'text', nullable: true, name: 'business_purpose' })
  businessPurpose: string;

  // Ownership (from plan: owner_id UUID REFERENCES users(id))
  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  // Business Unit (from plan: business_unit_id UUID REFERENCES business_units(id))
  @Column({ type: 'uuid', nullable: true, name: 'business_unit_id' })
  businessUnitId: string;

  @ManyToOne(() => BusinessUnit, { nullable: true })
  @JoinColumn({ name: 'business_unit_id' })
  businessUnit: BusinessUnit;

  // Unique Identifier (from plan: unique_identifier VARCHAR(200) UNIQUE NOT NULL)
  @Column({ type: 'varchar', length: 200, unique: true, nullable: false, name: 'unique_identifier' })
  uniqueIdentifier: string;

  // Location (from plan: physical_location TEXT)
  @Column({ type: 'text', nullable: true, name: 'physical_location' })
  physicalLocation: string;

  // Criticality (from plan: criticality_level criticality_level_enum)
  @Column({
    type: 'enum',
    enum: CriticalityLevel,
    nullable: true,
    name: 'criticality_level',
  })
  criticalityLevel: CriticalityLevel;

  // Network Information (from plan: mac_addresses JSONB, ip_addresses JSONB)
  @Column({ type: 'jsonb', nullable: true, name: 'mac_addresses' })
  macAddresses: string[];

  @Column({ type: 'jsonb', nullable: true, name: 'ip_addresses' })
  ipAddresses: string[];

  // Software and Services (from plan: installed_software JSONB, active_ports_services JSONB)
  @Column({ type: 'jsonb', nullable: true, name: 'installed_software' })
  installedSoftware: Array<{ name: string; version: string; patch_level: string }>;

  @Column({ type: 'jsonb', nullable: true, name: 'active_ports_services' })
  activePortsServices: Array<{ port: number; service: string; protocol: string }>;

  // Approval and Connectivity (from plan)
  @Column({
    type: 'enum',
    enum: NetworkApprovalStatus,
    default: NetworkApprovalStatus.PENDING,
    name: 'network_approval_status',
  })
  networkApprovalStatus: NetworkApprovalStatus;

  @Column({
    type: 'enum',
    enum: ConnectivityStatus,
    default: ConnectivityStatus.UNKNOWN,
    name: 'connectivity_status',
  })
  connectivityStatus: ConnectivityStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'last_connectivity_check' })
  lastConnectivityCheck: Date;

  // Additional Metadata (from plan)
  @Column({ type: 'varchar', length: 200, nullable: true, name: 'serial_number' })
  serialNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'asset_tag' })
  assetTag: string;

  @Column({ type: 'date', nullable: true, name: 'purchase_date' })
  purchaseDate: Date;

  @Column({ type: 'date', nullable: true, name: 'warranty_expiry' })
  warrantyExpiry: Date;

  // Compliance and Security (from plan: compliance_requirements JSONB, security_test_results JSONB)
  @Column({ type: 'jsonb', nullable: true, name: 'compliance_requirements' })
  complianceRequirements: string[];

  @Column({ type: 'jsonb', nullable: true, name: 'security_test_results' })
  securityTestResults: {
    last_test_date: Date;
    findings: string;
    severity: string;
  };

  // Audit Fields (from plan: created_by, created_at, updated_by, updated_at, deleted_at)
  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
