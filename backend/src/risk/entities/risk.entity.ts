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
import { Tenant } from '../../common/entities/tenant.entity';

export enum RiskStatus {
  IDENTIFIED = 'identified',
  ASSESSED = 'assessed',
  MITIGATED = 'mitigated',
  ACCEPTED = 'accepted',
  CLOSED = 'closed',
}

export enum RiskStatusNew {
  ACTIVE = 'active',
  MONITORING = 'monitoring',
  CLOSED = 'closed',
  ACCEPTED = 'accepted',
}

export enum RiskCategoryLegacy {
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
@Index(['riskId'])
@Index(['categoryId'])
@Index(['currentRiskLevel'])
@Index(['nextReviewDate'])
export class Risk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', nullable: true })
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true, name: 'risk_id' })
  riskId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true, name: 'risk_statement' })
  riskStatement: string;

  @Column({ type: 'uuid', nullable: true, name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => RiskCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  riskCategory: RiskCategory;

  @Column({ type: 'uuid', nullable: true, name: 'sub_category_id' })
  subCategoryId: string;

  @ManyToOne(() => RiskCategory, { nullable: true })
  @JoinColumn({ name: 'sub_category_id' })
  riskSubCategory: RiskCategory;

  @Column({
    type: 'enum',
    enum: RiskStatus,
    default: RiskStatus.IDENTIFIED,
  })
  status: RiskStatus;

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

  // organizationId is no longer used as a column to avoid conflicts.
  organizationId: string;

  @Column({ name: 'ownerId', nullable: true, insert: false, update: false })
  ownerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'uuid', nullable: true, name: 'risk_analyst_id' })
  riskAnalystId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'risk_analyst_id' })
  riskAnalyst: User;

  @Column({ type: 'date', nullable: true, name: 'date_identified' })
  dateIdentified: Date;

  @Column({ type: 'date', nullable: true, name: 'next_review_date' })
  nextReviewDate: Date;

  @Column({ type: 'date', nullable: true, name: 'last_review_date' })
  lastReviewDate: Date;

  @Column({
    type: 'enum',
    enum: ThreatSource,
    nullable: true,
    name: 'threat_source',
  })
  threatSource: ThreatSource;

  @Column({
    type: 'enum',
    enum: RiskVelocity,
    nullable: true,
    name: 'risk_velocity',
  })
  riskVelocity: RiskVelocity;

  @Column({ type: 'text', nullable: true, name: 'early_warning_signs' })
  earlyWarningSigns: string;

  @Column({ type: 'text', nullable: true, name: 'status_notes' })
  statusNotes: string;

  @Column({ type: 'text', nullable: true, name: 'business_process' })
  businessProcess: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'uuid', array: true, nullable: true, name: 'business_unit_ids' })
  businessUnitIds: string[];

  @Column({ type: 'integer', default: 1, name: 'version_number' })
  versionNumber: number;

  @Column({ type: 'integer', nullable: true, name: 'inherent_likelihood' })
  inherentLikelihood: number;

  @Column({ type: 'integer', nullable: true, name: 'inherent_impact' })
  inherentImpact: number;

  @Column({ type: 'integer', nullable: true, name: 'inherent_risk_score' })
  inherentRiskScore: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
    name: 'inherent_risk_level',
  })
  inherentRiskLevel: RiskLevel;

  @Column({ type: 'integer', nullable: true, name: 'current_likelihood' })
  currentLikelihood: number;

  @Column({ type: 'integer', nullable: true, name: 'current_impact' })
  currentImpact: number;

  @Column({ type: 'integer', nullable: true, name: 'current_risk_score' })
  currentRiskScore: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
    name: 'current_risk_level',
  })
  currentRiskLevel: RiskLevel;

  @Column({ type: 'integer', nullable: true, name: 'target_likelihood' })
  targetLikelihood: number;

  @Column({ type: 'integer', nullable: true, name: 'target_impact' })
  targetImpact: number;

  @Column({ type: 'integer', nullable: true, name: 'target_risk_score' })
  targetRiskScore: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
    name: 'target_risk_level',
  })
  targetRiskLevel: RiskLevel;

  @Column({ type: 'integer', nullable: true, name: 'control_effectiveness' })
  controlEffectiveness: number;

  @OneToMany(() => RiskAssessment, (assessment) => assessment.risk)
  assessments: RiskAssessment[];

  @OneToMany(() => RiskAssetLink, (link) => link.risk)
  assetLinks: RiskAssetLink[];

  @OneToMany(() => RiskControlLink, (link) => link.risk)
  controlLinks: RiskControlLink[];

  @OneToMany(() => RiskTreatment, (treatment) => treatment.risk)
  treatments: RiskTreatment[];

  @OneToMany(() => KRIRiskLink, (link) => link.risk)
  kriLinks: KRIRiskLink[];

  @Column({ name: 'created_by', nullable: true, insert: false, update: false })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({
    type: 'enum',
    enum: RiskCategoryLegacy,
    nullable: true,
    name: 'category',
  })
  category: RiskCategoryLegacy;
}
