import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { RiskCategory } from './risk-category.entity';
import { User } from '../../users/entities/user.entity';
import { KRIMeasurement } from './kri-measurement.entity';
import { KRIRiskLink } from './kri-risk-link.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum MeasurementFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

export enum KRIStatus {
  GREEN = 'green',
  AMBER = 'amber',
  RED = 'red',
}

export enum KRITrend {
  IMPROVING = 'improving',
  STABLE = 'stable',
  WORSENING = 'worsening',
}

@Entity('kris')
@Index(['kri_id'])
@Index(['category_id'])
@Index(['current_status'])
@Index(['is_active'])
@Index(['kri_owner_id'])
export class KRI {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true, name: 'kri_id' })
  kri_id: string;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true, name: 'category_id' })
  category_id: string;

  @ManyToOne(() => RiskCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: RiskCategory;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'measurement_unit' })
  measurement_unit: string;

  @Column({
    type: 'enum',
    enum: MeasurementFrequency,
    enumName: 'measurement_frequency_enum',
    default: MeasurementFrequency.MONTHLY,
    name: 'measurement_frequency',
  })
  measurement_frequency: MeasurementFrequency;

  @Column({ type: 'varchar', length: 300, nullable: true, name: 'data_source' })
  data_source: string;

  @Column({ type: 'text', nullable: true, name: 'calculation_method' })
  calculation_method: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'threshold_green' })
  threshold_green: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'threshold_amber' })
  threshold_amber: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'threshold_red' })
  threshold_red: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'lower_better',
    name: 'threshold_direction',
  })
  threshold_direction: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'current_value' })
  current_value: number;

  @Column({
    type: 'enum',
    enum: KRIStatus,
    enumName: 'kri_status',
    nullable: true,
    name: 'current_status',
  })
  current_status: KRIStatus;

  @Column({
    type: 'enum',
    enum: KRITrend,
    enumName: 'kri_trend',
    nullable: true,
  })
  trend: KRITrend;

  @Column({ type: 'uuid', nullable: true, name: 'kri_owner_id' })
  kri_owner_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'kri_owner_id' })
  kri_owner: User;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'last_measured_at' })
  last_measured_at: Date;

  @Column({ type: 'date', nullable: true, name: 'next_measurement_due' })
  next_measurement_due: Date;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'target_value' })
  target_value: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'baseline_value' })
  baseline_value: number;

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @OneToMany(() => KRIMeasurement, (measurement) => measurement.kri)
  measurements: KRIMeasurement[];

  @OneToMany(() => KRIRiskLink, (link) => link.kri)
  risk_links: KRIRiskLink[];

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updated_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
