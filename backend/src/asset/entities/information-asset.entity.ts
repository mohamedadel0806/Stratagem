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

export enum ClassificationLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
  SECRET = 'secret',
}

@Entity('information_assets')
@Index(['informationType'])
@Index(['classificationLevel'])
@Index(['informationOwnerId'])
@Index(['assetCustodianId'])
@Index(['businessUnitId'])
@Index(['reclassificationDate'], { where: 'reclassification_date IS NOT NULL' })
export class InformationAsset {
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

  // Basic Information (from plan: information_type VARCHAR(200) NOT NULL, name VARCHAR(300) NOT NULL)
  @Column({ type: 'varchar', length: 200, nullable: false, name: 'information_type' })
  informationType: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Classification (from plan: classification_level classification_level_enum NOT NULL)
  @Column({
    type: 'enum',
    enum: ClassificationLevel,
    nullable: false,
    name: 'classification_level',
  })
  classificationLevel: ClassificationLevel;

  @Column({ type: 'date', nullable: true, name: 'classification_date' })
  classificationDate: Date;

  @Column({ type: 'date', nullable: true, name: 'reclassification_date' })
  reclassificationDate: Date;

  @Column({ type: 'boolean', default: false, name: 'reclassification_reminder_sent' })
  reclassificationReminderSent: boolean;

  // Ownership (from plan: information_owner_id, asset_custodian_id)
  @Column({ type: 'uuid', nullable: true, name: 'information_owner_id' })
  informationOwnerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'information_owner_id' })
  informationOwner: User;

  @Column({ type: 'uuid', nullable: true, name: 'asset_custodian_id' })
  assetCustodianId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'asset_custodian_id' })
  assetCustodian: User;

  // Business Unit (from plan: business_unit_id UUID REFERENCES business_units(id))
  @Column({ type: 'uuid', nullable: true, name: 'business_unit_id' })
  businessUnitId: string;

  @ManyToOne(() => BusinessUnit, { nullable: true })
  @JoinColumn({ name: 'business_unit_id' })
  businessUnit: BusinessUnit;

  // Location and Storage (from plan: asset_location TEXT, storage_medium VARCHAR(200))
  @Column({ type: 'text', nullable: true, name: 'asset_location' })
  assetLocation: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'storage_medium' })
  storageMedium: string;

  // Compliance (from plan: compliance_requirements JSONB, retention_period VARCHAR(100))
  @Column({ type: 'jsonb', nullable: true, name: 'compliance_requirements' })
  complianceRequirements: string[];

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'retention_period' })
  retentionPeriod: string;

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
