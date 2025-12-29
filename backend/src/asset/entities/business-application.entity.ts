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
import { ClassificationLevel } from './information-asset.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum CriticalityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ApplicationType {
  WEB_APPLICATION = 'Web Application',
  MOBILE_APP = 'Mobile App',
  API_SERVICE = 'API Service',
  DATABASE = 'Database',
}

export enum ApplicationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated',
  RETIRED = 'retired',
}

@Entity('business_applications')
@Index(['applicationName'])
@Index(['applicationType'])
@Index(['ownerId'])
@Index(['businessUnitId'])
@Index(['criticalityLevel'])
@Index(['vendorName'])
export class BusinessApplication {
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

  // Basic Information (from plan: application_name VARCHAR(300) NOT NULL, application_type VARCHAR(200))
  @Column({ type: 'varchar', length: 300, nullable: false, name: 'application_name' })
  applicationName: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'application_type' })
  applicationType: string;

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

  // Data Processed (from plan: data_processed JSONB, data_classification classification_level_enum)
  @Column({ type: 'jsonb', nullable: true, name: 'data_processed' })
  dataProcessed: string[];

  @Column({
    type: 'enum',
    enum: ClassificationLevel,
    nullable: true,
    name: 'data_classification',
  })
  dataClassification: ClassificationLevel;

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

  @Column({ type: 'date', nullable: true, name: 'license_expiry' })
  licenseExpiry: Date;

  // Hosting and Access (from plan: hosting_type VARCHAR(100), hosting_location TEXT, access_url TEXT)
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'hosting_type' })
  hostingType: string;

  @Column({ type: 'text', nullable: true, name: 'hosting_location' })
  hostingLocation: string;

  @Column({ type: 'text', nullable: true, name: 'access_url' })
  accessUrl: string;

  // Security (from plan: security_test_results JSONB, last_security_test_date DATE, authentication_method VARCHAR(100))
  @Column({ type: 'jsonb', nullable: true, name: 'security_test_results' })
  securityTestResults: any;

  @Column({ type: 'date', nullable: true, name: 'last_security_test_date' })
  lastSecurityTestDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'authentication_method' })
  authenticationMethod: string;

  // Compliance (from plan: compliance_requirements JSONB, criticality_level criticality_level_enum)
  @Column({ type: 'jsonb', nullable: true, name: 'compliance_requirements' })
  complianceRequirements: string[];

  @Column({
    type: 'enum',
    enum: CriticalityLevel,
    nullable: true,
    name: 'criticality_level',
  })
  criticalityLevel: CriticalityLevel;

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
