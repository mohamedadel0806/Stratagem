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
import { User } from '../../users/entities/user.entity';
import { RiskCategory } from './risk-category.entity';
import { RiskAssessment } from './risk-assessment.entity';
import { RiskAssetLink } from './risk-asset-link.entity';
import { RiskControlLink } from './risk-control-link.entity';
import { RiskTreatment } from './risk-treatment.entity';
import { KRIRiskLink } from './kri-risk-link.entity';

// Keep original enums for backward compatibility
export enum RiskStatus {
  IDENTIFIED = 'identified',
  ASSESSED = 'assessed',
  MITIGATED = 'mitigated',
  ACCEPTED = 'accepted',
  CLOSED = 'closed',
}

// New status enum (will be used going forward)
export enum RiskStatusNew {
  ACTIVE = 'active',
  MONITORING = 'monitoring',
  CLOSED = 'closed',
  ACCEPTED = 'accepted',
}

export enum RiskCategory_OLD {
  CYBERSECURITY = 'cybersecurity',
  DATA_PRIVACY = 'data_privacy',
  COMPLIANCE = 'compliance',
  OPERATIONAL = 'operational',
  FINANCIAL = 'financial',
  STRATEGIC = 'strategic',
  REPUTATIONAL = 'reputational',
}

export enum RiskLikelihood {
  VERY_LOW = 1,
  LOW = 2,
  MEDIUM = 3,
  HIGH = 4,
  VERY_HIGH = 5,
}

export enum RiskImpact {
  VERY_LOW = 1,
  LOW = 2,
  MEDIUM = 3,
  HIGH = 4,
  VERY_HIGH = 5,
}

export enum ThreatSource {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  NATURAL = 'natural',
}

export enum RiskVelocity {
  SLOW = 'slow',
  MEDIUM = 'medium',
  FAST = 'fast',
  IMMEDIATE = 'immediate',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('risks')
@Index(['risk_id'])
@Index(['category_id'])
@Index(['current_risk_level'])
@Index(['next_review_date'])
export class Risk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Auto-generated risk identifier (RISK-0001, RISK-0002, etc.)
  @Column({ type: 'varchar', length: 20, unique: true, nullable: true, name: 'risk_id' })
  risk_id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Risk statement in If/Then/Resulting format
  @Column({ type: 'text', nullable: true, name: 'risk_statement' })
  risk_statement: string;

  // Legacy category field (keeping for backward compatibility)
  @Column({
    type: 'enum',
    enum: RiskCategory_OLD,
    default: RiskCategory_OLD.COMPLIANCE,
    name: 'category',
  })
  category: RiskCategory_OLD;

  // New category reference
  @Column({ type: 'uuid', nullable: true, name: 'category_id' })
  category_id: string;

  @ManyToOne(() => RiskCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  risk_category: RiskCategory;

  // Sub-category reference
  @Column({ type: 'uuid', nullable: true, name: 'sub_category_id' })
  sub_category_id: string;

  @ManyToOne(() => RiskCategory, { nullable: true })
  @JoinColumn({ name: 'sub_category_id' })
  risk_sub_category: RiskCategory;

  @Column({
    type: 'enum',
    enum: RiskStatus,
    default: RiskStatus.IDENTIFIED,
  })
  status: RiskStatus;

  // Legacy likelihood/impact (keeping for backward compatibility)
  @Column({
    type: 'enum',
    enum: RiskLikelihood,
    default: RiskLikelihood.MEDIUM,
  })
  likelihood: RiskLikelihood;

  @Column({
    type: 'enum',
    enum: RiskImpact,
    default: RiskImpact.MEDIUM,
  })
  impact: RiskImpact;

  // Organization and ownership
  @Column({ type: 'uuid', nullable: true, name: 'organizationId' })
  organizationId: string;

  @Column({ type: 'uuid', nullable: true, name: 'ownerId' })
  ownerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  // Risk analyst
  @Column({ type: 'uuid', nullable: true, name: 'risk_analyst_id' })
  risk_analyst_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'risk_analyst_id' })
  risk_analyst: User;

  // Dates
  @Column({ type: 'date', nullable: true, name: 'date_identified' })
  date_identified: Date;

  @Column({ type: 'date', nullable: true, name: 'next_review_date' })
  next_review_date: Date;

  @Column({ type: 'date', nullable: true, name: 'last_review_date' })
  last_review_date: Date;

  // Risk characteristics
  @Column({
    type: 'enum',
    enum: ThreatSource,
    nullable: true,
    name: 'threat_source',
  })
  threat_source: ThreatSource;

  @Column({
    type: 'enum',
    enum: RiskVelocity,
    nullable: true,
    name: 'risk_velocity',
  })
  risk_velocity: RiskVelocity;

  @Column({ type: 'text', nullable: true, name: 'early_warning_signs' })
  early_warning_signs: string;

  @Column({ type: 'text', nullable: true, name: 'status_notes' })
  status_notes: string;

  @Column({ type: 'text', nullable: true, name: 'business_process' })
  business_process: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'uuid', array: true, nullable: true, name: 'business_unit_ids' })
  business_unit_ids: string[];

  // Version tracking
  @Column({ type: 'integer', default: 1, name: 'version_number' })
  version_number: number;

  // Inherent risk assessment (before controls)
  @Column({ type: 'integer', nullable: true, name: 'inherent_likelihood' })
  inherent_likelihood: number;

  @Column({ type: 'integer', nullable: true, name: 'inherent_impact' })
  inherent_impact: number;

  @Column({ type: 'integer', nullable: true, name: 'inherent_risk_score' })
  inherent_risk_score: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
    name: 'inherent_risk_level',
  })
  inherent_risk_level: RiskLevel;

  // Current risk assessment (with existing controls)
  @Column({ type: 'integer', nullable: true, name: 'current_likelihood' })
  current_likelihood: number;

  @Column({ type: 'integer', nullable: true, name: 'current_impact' })
  current_impact: number;

  @Column({ type: 'integer', nullable: true, name: 'current_risk_score' })
  current_risk_score: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
    name: 'current_risk_level',
  })
  current_risk_level: RiskLevel;

  // Target risk assessment (desired state)
  @Column({ type: 'integer', nullable: true, name: 'target_likelihood' })
  target_likelihood: number;

  @Column({ type: 'integer', nullable: true, name: 'target_impact' })
  target_impact: number;

  @Column({ type: 'integer', nullable: true, name: 'target_risk_score' })
  target_risk_score: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
    name: 'target_risk_level',
  })
  target_risk_level: RiskLevel;

  // Control effectiveness (calculated from linked controls)
  @Column({ type: 'integer', nullable: true, name: 'control_effectiveness' })
  control_effectiveness: number;

  // Relationships
  @OneToMany(() => RiskAssessment, (assessment) => assessment.risk)
  assessments: RiskAssessment[];

  @OneToMany(() => RiskAssetLink, (link) => link.risk)
  asset_links: RiskAssetLink[];

  @OneToMany(() => RiskControlLink, (link) => link.risk)
  control_links: RiskControlLink[];

  @OneToMany(() => RiskTreatment, (treatment) => treatment.risk)
  treatments: RiskTreatment[];

  @OneToMany(() => KRIRiskLink, (link) => link.risk)
  kri_links: KRIRiskLink[];

  // Audit fields
  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updated_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
