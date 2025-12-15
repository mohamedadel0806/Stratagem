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
import { Risk, RiskLevel } from './risk.entity';
import { User } from '../../users/entities/user.entity';

export enum AssessmentType {
  INHERENT = 'inherent',
  CURRENT = 'current',
  TARGET = 'target',
}

export enum ImpactLevel {
  NEGLIGIBLE = 'negligible',
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CATASTROPHIC = 'catastrophic',
}

export enum ConfidenceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Entity('risk_assessments')
@Index(['risk_id'])
@Index(['assessment_type'])
@Index(['assessment_date'])
@Index(['risk_level'])
export class RiskAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'risk_id' })
  risk_id: string;

  @ManyToOne(() => Risk, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'risk_id' })
  risk: Risk;

  @Column({
    type: 'enum',
    enum: AssessmentType,
    enumName: 'assessment_type_enum',
    name: 'assessment_type',
  })
  assessment_type: AssessmentType;

  @Column({ type: 'integer', comment: '1-5 scale' })
  likelihood: number;

  @Column({ type: 'integer', comment: '1-5 scale' })
  impact: number;

  @Column({ type: 'integer', nullable: true, name: 'risk_score' })
  risk_score: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    enumName: 'risk_level_enum',
    nullable: true,
    name: 'risk_level',
  })
  risk_level: RiskLevel;

  @Column({
    type: 'enum',
    enum: ImpactLevel,
    enumName: 'impact_level_enum',
    nullable: true,
    name: 'financial_impact',
  })
  financial_impact: ImpactLevel;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'financial_impact_amount',
  })
  financial_impact_amount: number;

  @Column({
    type: 'enum',
    enum: ImpactLevel,
    enumName: 'impact_level_enum',
    nullable: true,
    name: 'operational_impact',
  })
  operational_impact: ImpactLevel;

  @Column({
    type: 'enum',
    enum: ImpactLevel,
    enumName: 'impact_level_enum',
    nullable: true,
    name: 'reputational_impact',
  })
  reputational_impact: ImpactLevel;

  @Column({
    type: 'enum',
    enum: ImpactLevel,
    enumName: 'impact_level_enum',
    nullable: true,
    name: 'compliance_impact',
  })
  compliance_impact: ImpactLevel;

  @Column({
    type: 'enum',
    enum: ImpactLevel,
    enumName: 'impact_level_enum',
    nullable: true,
    name: 'safety_impact',
  })
  safety_impact: ImpactLevel;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'assessment_date' })
  assessment_date: Date;

  @Column({ type: 'uuid', nullable: true, name: 'assessor_id' })
  assessor_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assessor_id' })
  assessor: User;

  @Column({
    type: 'varchar',
    length: 100,
    default: 'qualitative_5x5',
    name: 'assessment_method',
  })
  assessment_method: string;

  @Column({ type: 'text', nullable: true, name: 'assessment_notes' })
  assessment_notes: string;

  @Column({ type: 'text', nullable: true })
  assumptions: string;

  @Column({
    type: 'enum',
    enum: ConfidenceLevel,
    enumName: 'confidence_level_enum',
    default: ConfidenceLevel.MEDIUM,
    name: 'confidence_level',
  })
  confidence_level: ConfidenceLevel;

  @Column({ type: 'jsonb', nullable: true, name: 'evidence_attachments' })
  evidence_attachments: Record<string, any>[];

  @Column({ type: 'boolean', default: true, name: 'is_latest' })
  is_latest: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

