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
import { User } from '../../../users/entities/user.entity';

export enum ComplianceScore {
  EXCELLENT = 'EXCELLENT',    // 85-100%
  GOOD = 'GOOD',              // 70-84%
  FAIR = 'FAIR',              // 55-69%
  POOR = 'POOR',              // 0-54%
}

export enum ReportPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  CUSTOM = 'CUSTOM',
}

@Entity('compliance_reports')
@Index('idx_compliance_reports_period_date', ['period_start_date', 'period_end_date'])
@Index('idx_compliance_reports_overall_score', ['overall_compliance_score'])
@Index('idx_compliance_reports_created_at', ['created_at'])
@Index('idx_compliance_reports_created_by', ['created_by_id'])
export class ComplianceReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  report_name: string;

  @Column({ type: 'enum', enum: ReportPeriod, default: ReportPeriod.MONTHLY })
  report_period: ReportPeriod;

  @Column({ type: 'date' })
  period_start_date: Date;

  @Column({ type: 'date' })
  period_end_date: Date;

  // Overall Compliance Metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overall_compliance_score: number; // 0-100, overall organization score

  @Column({ type: 'enum', enum: ComplianceScore })
  overall_compliance_rating: ComplianceScore;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  policies_compliance_score: number; // Score from policy compliance

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  controls_compliance_score: number; // Score from control implementation

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  assets_compliance_score: number; // Score from asset compliance

  // Policy Metrics
  @Column({ type: 'int', default: 0 })
  total_policies: number;

  @Column({ type: 'int', default: 0 })
  policies_published: number;

  @Column({ type: 'int', default: 0 })
  policies_acknowledged: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  policy_acknowledgment_rate: number; // percentage

  // Control Metrics
  @Column({ type: 'int', default: 0 })
  total_controls: number;

  @Column({ type: 'int', default: 0 })
  controls_implemented: number;

  @Column({ type: 'int', default: 0 })
  controls_partial: number;

  @Column({ type: 'int', default: 0 })
  controls_not_implemented: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  average_control_effectiveness: number; // 0-100

  // Asset Metrics
  @Column({ type: 'int', default: 0 })
  total_assets: number;

  @Column({ type: 'int', default: 0 })
  assets_compliant: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  asset_compliance_percentage: number; // percentage

  // Gap Analysis
  @Column({ type: 'int', default: 0 })
  critical_gaps: number; // High-priority compliance gaps

  @Column({ type: 'int', default: 0 })
  medium_gaps: number;

  @Column({ type: 'int', default: 0 })
  low_gaps: number;

  @Column({ type: 'json', nullable: true })
  gap_details: {
    description: string;
    severity: 'CRITICAL' | 'MEDIUM' | 'LOW';
    affected_count: number;
  }[];

  // Department Breakdown (stored as JSON for flexibility)
  @Column({ type: 'json', nullable: true })
  department_breakdown: {
    department: string;
    compliance_score: number;
    policies_count: number;
    controls_assigned: number;
    assets_managed: number;
  }[];

  // Trend Data (month-over-month, quarter-over-quarter)
  @Column({ type: 'json', nullable: true })
  compliance_trend: {
    date: string;
    score: number;
    policies_score: number;
    controls_score: number;
    assets_score: number;
  }[];

  // Forecasting Data
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  projected_score_next_period: number; // Forecast for next period

  @Column({ type: 'int', nullable: true })
  projected_days_to_excellent: number; // Days until EXCELLENT rating at current pace

  @Column({ type: 'varchar', nullable: true })
  trend_direction: 'IMPROVING' | 'STABLE' | 'DECLINING'; // Trend indicator

  // Executive Summary
  @Column({ type: 'text', nullable: true })
  executive_summary: string; // Human-readable summary for executives

  @Column({ type: 'text', nullable: true })
  key_findings: string; // Key findings and highlights

  @Column({ type: 'text', nullable: true })
  recommendations: string; // Recommendations for improvement

  // Metadata
  @Column({ type: 'boolean', default: false })
  is_final: boolean; // True if report is finalized, false if draft

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ type: 'uuid', nullable: true })
  created_by_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  generated_at: Date; // When the report was actually generated
}
