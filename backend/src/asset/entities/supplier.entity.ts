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
import { CriticalityLevel } from './physical-asset.entity';

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

  // Basic Information (from plan: unique_identifier VARCHAR(100) UNIQUE NOT NULL, supplier_name VARCHAR(300) NOT NULL)
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  uniqueIdentifier: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  supplierName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  supplierType: string;

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

  // Services (from plan: goods_services_type JSONB, criticality_level criticality_level_enum)
  @Column({ type: 'jsonb', nullable: true })
  goodsServicesType: string[];

  @Column({
    type: 'enum',
    enum: CriticalityLevel,
    nullable: true,
  })
  criticalityLevel: CriticalityLevel;

  // Contract Information (from plan)
  @Column({ type: 'varchar', length: 200, nullable: true })
  contractReference: string;

  @Column({ type: 'date', nullable: true })
  contractStartDate: Date;

  @Column({ type: 'date', nullable: true })
  contractEndDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  contractValue: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string;

  @Column({ type: 'boolean', default: false })
  autoRenewal: boolean;

  // Contact Information (from plan: primary_contact JSONB, secondary_contact JSONB)
  @Column({ type: 'jsonb', nullable: true })
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  secondaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };

  // Company Details (from plan)
  @Column({ type: 'varchar', length: 100, nullable: true })
  taxId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  registrationNumber: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  // Risk and Compliance (from plan)
  @Column({ type: 'date', nullable: true })
  riskAssessmentDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  riskLevel: string;

  @Column({ type: 'jsonb', nullable: true })
  complianceCertifications: string[];

  @Column({ type: 'boolean', default: false })
  insuranceVerified: boolean;

  @Column({ type: 'date', nullable: true })
  backgroundCheckDate: Date;

  // Performance (from plan: performance_rating DECIMAL(3, 2), last_review_date DATE)
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  performanceRating: number;

  @Column({ type: 'date', nullable: true })
  lastReviewDate: Date;

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

