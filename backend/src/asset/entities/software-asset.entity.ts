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
import { BusinessUnit } from '../../common/entities/business-unit.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum SoftwareType {
  OPERATING_SYSTEM = 'Operating System',
  APPLICATION_SOFTWARE = 'Application Software',
  SECURITY_SOFTWARE = 'Security Software',
  DATABASE_SOFTWARE = 'Database Software',
  DEVELOPMENT_TOOL = 'Development Tool',
}

@Entity('software_assets')
@Index(['softwareName'])
@Index(['softwareType'])
@Index(['ownerId'])
@Index(['businessUnitId'])
@Index(['vendorName'])
@Index(['licenseExpiry'], { where: 'license_expiry IS NOT NULL' })
export class SoftwareAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 200, nullable: false, name: 'unique_identifier' })
  uniqueIdentifier: string;

  // Basic Information (from plan: software_name VARCHAR(300) NOT NULL, software_type VARCHAR(200))
  @Column({ type: 'varchar', length: 300, nullable: false, name: 'software_name' })
  softwareName: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'software_type' })
  softwareType: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'version_number' })
  versionNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'patch_level' })
  patchLevel: string;

  // Business Context (from plan: business_purpose TEXT, owner_id, business_unit_id)
  @Column({ type: 'text', nullable: true, name: 'business_purpose' })
  businessPurpose: string;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'uuid', nullable: true, name: 'business_unit_id' })
  businessUnitId: string;

  @ManyToOne(() => BusinessUnit, { nullable: true })
  @JoinColumn({ name: 'business_unit_id' })
  businessUnit: BusinessUnit;

  // Technical Details (from plan: vendor_name VARCHAR(200), vendor_contact JSONB)
  @Column({ type: 'varchar', length: 200, nullable: true, name: 'vendor_name' })
  vendorName: string;

  @Column({ type: 'jsonb', nullable: true, name: 'vendor_contact' })
  vendorContact: {
    name: string;
    email: string;
    phone: string;
  };

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'license_type' })
  licenseType: string;

  @Column({ type: 'int', nullable: true, name: 'license_count' })
  licenseCount: number;

  @Column({ type: 'text', nullable: true, name: 'license_key' })
  licenseKey: string; // Encrypted

  @Column({ type: 'date', nullable: true, name: 'license_expiry' })
  licenseExpiry: Date;

  // Installation Tracking (from plan: installation_count INTEGER DEFAULT 0)
  @Column({ type: 'int', default: 0, name: 'installation_count' })
  installationCount: number;

  // Security (from plan: security_test_results JSONB, last_security_test_date DATE, known_vulnerabilities JSONB)
  @Column({ type: 'jsonb', nullable: true, name: 'security_test_results' })
  securityTestResults: any;

  @Column({ type: 'date', nullable: true, name: 'last_security_test_date' })
  lastSecurityTestDate: Date;

  @Column({ type: 'jsonb', nullable: true, name: 'known_vulnerabilities' })
  knownVulnerabilities: any[];

  // Support (from plan: support_end_date DATE)
  @Column({ type: 'date', nullable: true, name: 'support_end_date' })
  supportEndDate: Date;

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
