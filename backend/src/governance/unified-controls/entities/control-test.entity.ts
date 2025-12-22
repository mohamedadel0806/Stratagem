import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { UnifiedControl } from './unified-control.entity';
import { ControlAssetMapping } from './control-asset-mapping.entity';

export enum ControlTestType {
  DESIGN = 'design',
  OPERATING = 'operating',
  TECHNICAL = 'technical',
  MANAGEMENT = 'management',
}

export enum ControlTestStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ControlTestResult {
  PASS = 'pass',
  FAIL = 'fail',
  INCONCLUSIVE = 'inconclusive',
  NOT_APPLICABLE = 'not_applicable',
}

@Entity('control_tests')
@Index(['unified_control_id'])
@Index(['status'])
@Index(['test_date'])
@Index(['tester_id'])
export class ControlTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'unified_control_id' })
  unified_control_id: string;

  @ManyToOne(() => UnifiedControl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unified_control_id' })
  unified_control: UnifiedControl;

  @Column({ type: 'uuid', name: 'control_asset_mapping_id', nullable: true })
  control_asset_mapping_id: string | null;

  @ManyToOne(() => ControlAssetMapping, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'control_asset_mapping_id' })
  control_asset_mapping: ControlAssetMapping | null;

  @Column({
    type: 'enum',
    enum: ControlTestType,
    default: ControlTestType.OPERATING,
  })
  test_type: ControlTestType;

  @Column({ type: 'date', name: 'test_date' })
  test_date: Date;

  @Column({
    type: 'enum',
    enum: ControlTestStatus,
    default: ControlTestStatus.PLANNED,
  })
  status: ControlTestStatus;

  @Column({
    type: 'enum',
    enum: ControlTestResult,
    nullable: true,
  })
  result: ControlTestResult | null;

  @Column({ type: 'integer', nullable: true, name: 'effectiveness_score' })
  effectiveness_score: number | null; // 0-100

  @Column({ type: 'text', nullable: true })
  test_procedure: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'jsonb', nullable: true, name: 'evidence_links' })
  evidence_links: Array<{ title: string; url: string; uploaded_at: string }>;

  @Column({ type: 'uuid', nullable: true, name: 'tester_id' })
  tester_id: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'tester_id' })
  tester: User | null;

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


