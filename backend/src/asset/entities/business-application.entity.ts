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
import { ClassificationLevel } from './information-asset.entity';

export enum CriticalityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
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

  @Column({ type: 'varchar', length: 200, nullable: false, name: 'unique_identifier' })
  uniqueIdentifier: string;

  // Basic Information (from plan: application_name VARCHAR(300) NOT NULL, application_type VARCHAR(200))
  @Column({ type: 'varchar', length: 300, nullable: false })
  applicationName: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  applicationType: string;

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

  // Data Processed (from plan: data_processed JSONB, data_classification classification_level_enum)
  @Column({ type: 'jsonb', nullable: true })
  dataProcessed: string[];

  @Column({
    type: 'enum',
    enum: ClassificationLevel,
    nullable: true,
  })
  dataClassification: ClassificationLevel;

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

  @Column({ type: 'date', nullable: true })
  licenseExpiry: Date;

  // Hosting and Access (from plan: hosting_type VARCHAR(100), hosting_location TEXT, access_url TEXT)
  @Column({ type: 'varchar', length: 100, nullable: true })
  hostingType: string;

  @Column({ type: 'text', nullable: true })
  hostingLocation: string;

  @Column({ type: 'text', nullable: true })
  accessUrl: string;

  // Security (from plan: security_test_results JSONB, last_security_test_date DATE, authentication_method VARCHAR(100))
  @Column({ type: 'jsonb', nullable: true })
  securityTestResults: any;

  @Column({ type: 'date', nullable: true })
  lastSecurityTestDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  authenticationMethod: string;

  // Compliance (from plan: compliance_requirements JSONB, criticality_level criticality_level_enum)
  @Column({ type: 'jsonb', nullable: true })
  complianceRequirements: string[];

  @Column({
    type: 'enum',
    enum: CriticalityLevel,
    nullable: true,
  })
  criticalityLevel: CriticalityLevel;

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

