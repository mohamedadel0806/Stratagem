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
import { BusinessUnit } from '../../common/entities/business-unit.entity';

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

  @Column({ type: 'varchar', length: 200, nullable: false, name: 'unique_identifier' })
  uniqueIdentifier: string;

  // Basic Information (from plan: software_name VARCHAR(300) NOT NULL, software_type VARCHAR(200))
  @Column({ type: 'varchar', length: 300, nullable: false })
  softwareName: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  softwareType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  versionNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  patchLevel: string;

  // Business Context (from plan: business_purpose TEXT, owner_id, business_unit_id)
  @Column({ type: 'text', nullable: true })
  businessPurpose: string;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'uuid', nullable: true })
  businessUnitId: string;

  @ManyToOne(() => BusinessUnit, { nullable: true })
  @JoinColumn({ name: 'business_unit_id' })
  businessUnit: BusinessUnit;

  // Technical Details (from plan: vendor_name VARCHAR(200), vendor_contact JSONB)
  @Column({ type: 'varchar', length: 200, nullable: true })
  vendorName: string;

  @Column({ type: 'jsonb', nullable: true })
  vendorContact: {
    name: string;
    email: string;
    phone: string;
  };

  @Column({ type: 'varchar', length: 100, nullable: true })
  licenseType: string;

  @Column({ type: 'int', nullable: true })
  licenseCount: number;

  @Column({ type: 'text', nullable: true })
  licenseKey: string; // Encrypted

  @Column({ type: 'date', nullable: true })
  licenseExpiry: Date;

  // Installation Tracking (from plan: installation_count INTEGER DEFAULT 0)
  @Column({ type: 'int', default: 0 })
  installationCount: number;

  // Security (from plan: security_test_results JSONB, last_security_test_date DATE, known_vulnerabilities JSONB)
  @Column({ type: 'jsonb', nullable: true })
  securityTestResults: any;

  @Column({ type: 'date', nullable: true })
  lastSecurityTestDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  knownVulnerabilities: any[];

  // Support (from plan: support_end_date DATE)
  @Column({ type: 'date', nullable: true })
  supportEndDate: Date;

  // Audit Fields (from plan: created_by, created_at, updated_by, updated_at, deleted_at)
  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;
}

