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
import { BusinessApplication } from './business-application.entity';
import { SoftwareAsset } from './software-asset.entity';
import { User } from '../../users/entities/user.entity';

export enum TestType {
  PENETRATION_TEST = 'penetration_test',
  VULNERABILITY_SCAN = 'vulnerability_scan',
  CODE_REVIEW = 'code_review',
  COMPLIANCE_AUDIT = 'compliance_audit',
  SECURITY_ASSESSMENT = 'security_assessment',
  OTHER = 'other',
}

export enum TestStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum SeverityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
  PASSED = 'passed',
}

@Entity('security_test_results')
@Index(['assetType', 'assetId'])
@Index(['testDate'])
@Index(['status'])
@Index(['severity'])
export class SecurityTestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['application', 'software'],
    name: 'asset_type',
  })
  assetType: 'application' | 'software';

  @Column({ type: 'uuid', name: 'asset_id' })
  assetId: string;

  @ManyToOne(() => BusinessApplication, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id', referencedColumnName: 'id' })
  application?: BusinessApplication;

  @ManyToOne(() => SoftwareAsset, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id', referencedColumnName: 'id' })
  software?: SoftwareAsset;

  @Column({
    type: 'enum',
    enum: TestType,
    name: 'test_type',
  })
  testType: TestType;

  @Column({ type: 'date', name: 'test_date' })
  testDate: Date;

  @Column({
    type: 'enum',
    enum: TestStatus,
    default: TestStatus.COMPLETED,
  })
  status: TestStatus;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'tester_name' })
  testerName?: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'tester_company' })
  testerCompany?: string;

  // Findings counts
  @Column({ type: 'int', default: 0, name: 'findings_critical' })
  findingsCritical: number;

  @Column({ type: 'int', default: 0, name: 'findings_high' })
  findingsHigh: number;

  @Column({ type: 'int', default: 0, name: 'findings_medium' })
  findingsMedium: number;

  @Column({ type: 'int', default: 0, name: 'findings_low' })
  findingsLow: number;

  @Column({ type: 'int', default: 0, name: 'findings_info' })
  findingsInfo: number;

  @Column({
    type: 'enum',
    enum: SeverityLevel,
    nullable: true,
  })
  severity?: SeverityLevel;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'overall_score' })
  overallScore?: number;

  @Column({ type: 'boolean', default: false })
  passed: boolean;

  @Column({ type: 'text', nullable: true, name: 'summary' })
  summary?: string;

  @Column({ type: 'text', nullable: true, name: 'findings' })
  findings?: string;

  @Column({ type: 'text', nullable: true, name: 'recommendations' })
  recommendations?: string;

  // File references
  @Column({ type: 'uuid', nullable: true, name: 'report_file_id' })
  reportFileId?: string;

  @Column({ type: 'text', nullable: true, name: 'report_url' })
  reportUrl?: string;

  // Follow-up
  @Column({ type: 'date', nullable: true, name: 'remediation_due_date' })
  remediationDueDate?: Date;

  @Column({ type: 'boolean', default: false, name: 'remediation_completed' })
  remediationCompleted: boolean;

  @Column({ type: 'boolean', default: false, name: 'retest_required' })
  retestRequired: boolean;

  @Column({ type: 'date', nullable: true, name: 'retest_date' })
  retestDate?: Date;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  createdBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

