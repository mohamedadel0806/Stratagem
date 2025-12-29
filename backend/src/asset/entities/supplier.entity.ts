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
import { CriticalityLevel } from './physical-asset.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export { CriticalityLevel };

export enum SupplierType {
  VENDOR = 'Vendor',
  SERVICE_PROVIDER = 'Service Provider',
  CONSULTANT = 'Consultant',
  CONTRACTOR = 'Contractor',
}

@Entity('suppliers')
@Index(['uniqueIdentifier'], { unique: true })
@Index(['supplierName'])
@Index(['ownerId'])
@Index(['businessUnitId'])
@Index(['criticalityLevel'])
@Index(['contractEndDate'], { where: 'contract_end_date IS NOT NULL' })
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  // Basic Information (from plan: unique_identifier VARCHAR(100) UNIQUE NOT NULL, supplier_name VARCHAR(300) NOT NULL)
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false, name: 'unique_identifier' })
  uniqueIdentifier: string;

  @Column({ type: 'varchar', length: 300, nullable: false, name: 'supplier_name' })
  supplierName: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'supplier_type' })
  supplierType: string;

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

  // Services (from plan: goods_services_type JSONB, criticality_level criticality_level_enum)
  @Column({ type: 'jsonb', nullable: true, name: 'goods_services_type' })
  goodsServicesType: string[];

  @Column({
    type: 'enum',
    enum: CriticalityLevel,
    nullable: true,
    name: 'criticality_level',
  })
  criticalityLevel: CriticalityLevel;

  // Contract Information (from plan)
  @Column({ type: 'varchar', length: 200, nullable: true, name: 'contract_reference' })
  contractReference: string;

  @Column({ type: 'date', nullable: true, name: 'contract_start_date' })
  contractStartDate: Date;

  @Column({ type: 'date', nullable: true, name: 'contract_end_date' })
  contractEndDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'contract_value' })
  contractValue: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string;

  @Column({ type: 'boolean', default: false, name: 'auto_renewal' })
  autoRenewal: boolean;

  // Contact Information (from plan: primary_contact JSONB, secondary_contact JSONB)
  @Column({ type: 'jsonb', nullable: true, name: 'primary_contact' })
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };

  @Column({ type: 'jsonb', nullable: true, name: 'secondary_contact' })
  secondaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };

  // Company Details (from plan)
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'tax_id' })
  taxId: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'registration_number' })
  registrationNumber: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  // Risk and Compliance (from plan)
  @Column({ type: 'date', nullable: true, name: 'risk_assessment_date' })
  riskAssessmentDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'risk_level' })
  riskLevel: string;

  @Column({ type: 'jsonb', nullable: true, name: 'compliance_certifications' })
  complianceCertifications: string[];

  @Column({ type: 'boolean', default: false, name: 'insurance_verified' })
  insuranceVerified: boolean;

  @Column({ type: 'date', nullable: true, name: 'background_check_date' })
  backgroundCheckDate: Date;

  // Performance (from plan: performance_rating DECIMAL(3, 2), last_review_date DATE)
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true, name: 'performance_rating' })
  performanceRating: number;

  @Column({ type: 'date', nullable: true, name: 'last_review_date' })
  lastReviewDate: Date;

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
