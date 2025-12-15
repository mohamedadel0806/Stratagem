import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Assessment } from './assessment.entity';
import { UnifiedControl } from '../../unified-controls/entities/unified-control.entity';

export enum AssessmentResultEnum {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PARTIALLY_COMPLIANT = 'partially_compliant',
  NOT_APPLICABLE = 'not_applicable',
  NOT_TESTED = 'not_tested',
}

@Entity('assessment_results')
@Index(['assessment_id'])
@Index(['unified_control_id'])
@Index(['result'])
@Index(['assessor_id'])
export class AssessmentResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'assessment_id' })
  assessment_id: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.results, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @Column({ type: 'uuid', name: 'unified_control_id' })
  unified_control_id: string;

  @ManyToOne(() => UnifiedControl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unified_control_id' })
  unified_control: UnifiedControl;

  @Column({ type: 'uuid', nullable: true, name: 'assessor_id' })
  assessor_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assessor_id' })
  assessor: User;

  @Column({ type: 'date', nullable: true, name: 'assessment_date' })
  assessment_date: Date;

  @Column({ type: 'text', nullable: true, name: 'assessment_procedure_followed' })
  assessment_procedure_followed: string;

  @Column({
    type: 'enum',
    enum: AssessmentResultEnum,
  })
  result: AssessmentResultEnum;

  @Column({ type: 'integer', nullable: true, name: 'effectiveness_rating' })
  effectiveness_rating: number;

  @Column({ type: 'text', nullable: true })
  findings: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'jsonb', nullable: true, name: 'evidence_collected' })
  evidence_collected: Array<{ filename: string; path: string; description: string }>;

  @Column({ type: 'boolean', default: false, name: 'requires_remediation' })
  requires_remediation: boolean;

  @Column({ type: 'date', nullable: true, name: 'remediation_due_date' })
  remediation_due_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}




