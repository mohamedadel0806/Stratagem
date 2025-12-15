import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('governance_metric_snapshots')
@Index(['snapshot_date'], { unique: true })
export class GovernanceMetricSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', unique: true, name: 'snapshot_date' })
  snapshot_date: string;

  @Column({ type: 'float', default: 0, name: 'compliance_rate' })
  compliance_rate: number;

  @Column({ type: 'integer', default: 0, name: 'implemented_controls' })
  implemented_controls: number;

  @Column({ type: 'integer', default: 0, name: 'total_controls' })
  total_controls: number;

  @Column({ type: 'integer', default: 0, name: 'open_findings' })
  open_findings: number;

  @Column({ type: 'integer', default: 0, name: 'critical_findings' })
  critical_findings: number;

  @Column({ type: 'float', default: 0, name: 'assessment_completion_rate' })
  assessment_completion_rate: number;

  @Column({ type: 'float', default: 0, name: 'risk_closure_rate' })
  risk_closure_rate: number;

  @Column({ type: 'integer', default: 0, name: 'completed_assessments' })
  completed_assessments: number;

  @Column({ type: 'integer', default: 0, name: 'total_assessments' })
  total_assessments: number;

  @Column({ type: 'integer', default: 0, name: 'approved_evidence' })
  approved_evidence: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
