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

/**
 * Risk Settings Entity
 * Stores organizational risk management configuration
 * Only one active settings record per organization
 */
@Entity('risk_settings')
@Index(['organization_id'], { unique: true })
export class RiskSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true, name: 'organization_id' })
  organization_id: string;

  // =====================
  // RISK LEVEL CONFIGURATION
  // =====================
  
  @Column({ type: 'jsonb', name: 'risk_levels', default: () => `'${JSON.stringify([
    { level: 'low', minScore: 1, maxScore: 5, color: '#22c55e', description: 'Acceptable risk - monitor periodically', responseTime: '90 days', escalation: false },
    { level: 'medium', minScore: 6, maxScore: 11, color: '#eab308', description: 'Moderate risk - implement controls', responseTime: '30 days', escalation: false },
    { level: 'high', minScore: 12, maxScore: 19, color: '#f97316', description: 'Significant risk - prioritize treatment', responseTime: '7 days', escalation: true },
    { level: 'critical', minScore: 20, maxScore: 25, color: '#dc2626', description: 'Unacceptable risk - immediate action required', responseTime: '24 hours', escalation: true },
  ])}'` })
  risk_levels: {
    level: string;
    minScore: number;
    maxScore: number;
    color: string;
    description: string;
    responseTime: string;
    escalation: boolean;
  }[];

  // =====================
  // ASSESSMENT METHODS
  // =====================
  
  @Column({ type: 'jsonb', name: 'assessment_methods', default: () => `'${JSON.stringify([
    { id: 'qualitative_5x5', name: 'Qualitative 5x5 Matrix', description: 'Standard 5-point scales for likelihood and impact', likelihoodScale: 5, impactScale: 5, isDefault: true, isActive: true },
    { id: 'qualitative_3x3', name: 'Simplified 3x3 Matrix', description: 'Basic 3-point scales for quick assessments', likelihoodScale: 3, impactScale: 3, isDefault: false, isActive: true },
    { id: 'bowtie', name: 'Bowtie Analysis', description: 'Cause-consequence analysis with barriers', likelihoodScale: 5, impactScale: 5, isDefault: false, isActive: false },
  ])}'` })
  assessment_methods: {
    id: string;
    name: string;
    description: string;
    likelihoodScale: number;
    impactScale: number;
    isDefault: boolean;
    isActive: boolean;
  }[];

  // =====================
  // LIKELIHOOD SCALE DESCRIPTIONS
  // =====================
  
  @Column({ type: 'jsonb', name: 'likelihood_scale', default: () => `'${JSON.stringify([
    { value: 1, label: 'Rare', description: 'Highly unlikely to occur (< 5% chance)' },
    { value: 2, label: 'Unlikely', description: 'Not expected but possible (5-20% chance)' },
    { value: 3, label: 'Possible', description: 'Could occur at some point (20-50% chance)' },
    { value: 4, label: 'Likely', description: 'More likely than not (50-80% chance)' },
    { value: 5, label: 'Almost Certain', description: 'Expected to occur (> 80% chance)' },
  ])}'` })
  likelihood_scale: {
    value: number;
    label: string;
    description: string;
  }[];

  // =====================
  // IMPACT SCALE DESCRIPTIONS
  // =====================
  
  @Column({ type: 'jsonb', name: 'impact_scale', default: () => `'${JSON.stringify([
    { value: 1, label: 'Negligible', description: 'Minimal impact on operations or objectives' },
    { value: 2, label: 'Minor', description: 'Limited impact, easily recoverable' },
    { value: 3, label: 'Moderate', description: 'Noticeable impact requiring management attention' },
    { value: 4, label: 'Major', description: 'Significant impact on key objectives' },
    { value: 5, label: 'Catastrophic', description: 'Severe impact threatening organizational survival' },
  ])}'` })
  impact_scale: {
    value: number;
    label: string;
    description: string;
  }[];

  // =====================
  // RISK APPETITE SETTINGS
  // =====================
  
  @Column({ type: 'integer', name: 'max_acceptable_risk_score', default: 11 })
  max_acceptable_risk_score: number;

  @Column({ type: 'varchar', length: 50, name: 'risk_acceptance_authority', default: 'executive' })
  risk_acceptance_authority: string;

  // =====================
  // GENERAL SETTINGS
  // =====================
  
  @Column({ type: 'integer', name: 'default_review_period_days', default: 90 })
  default_review_period_days: number;

  @Column({ type: 'boolean', name: 'auto_calculate_risk_score', default: true })
  auto_calculate_risk_score: boolean;

  @Column({ type: 'boolean', name: 'require_assessment_evidence', default: false })
  require_assessment_evidence: boolean;

  @Column({ type: 'boolean', name: 'enable_risk_appetite', default: true })
  enable_risk_appetite: boolean;

  @Column({ type: 'varchar', length: 50, name: 'default_assessment_method', default: 'qualitative_5x5' })
  default_assessment_method: string;

  // =====================
  // NOTIFICATION SETTINGS
  // =====================
  
  @Column({ type: 'boolean', name: 'notify_on_high_risk', default: true })
  notify_on_high_risk: boolean;

  @Column({ type: 'boolean', name: 'notify_on_critical_risk', default: true })
  notify_on_critical_risk: boolean;

  @Column({ type: 'boolean', name: 'notify_on_review_due', default: true })
  notify_on_review_due: boolean;

  @Column({ type: 'integer', name: 'review_reminder_days', default: 7 })
  review_reminder_days: number;

  // =====================
  // VERSION TRACKING
  // =====================
  
  @Column({ type: 'integer', default: 1, name: 'version' })
  version: number;

  // =====================
  // AUDIT FIELDS
  // =====================
  
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
}







