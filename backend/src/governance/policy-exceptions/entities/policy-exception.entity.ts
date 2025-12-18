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
import { BusinessUnit } from '../../../common/entities/business-unit.entity';

export enum ExceptionStatus {
  REQUESTED = 'requested',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export enum ExceptionType {
  POLICY = 'policy',
  STANDARD = 'standard',
  CONTROL = 'control',
  BASELINE = 'baseline',
}

@Entity('policy_exceptions')
@Index(['exception_identifier'])
@Index(['entity_type', 'entity_id'])
@Index(['status'])
@Index(['requested_by'])
export class PolicyException {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  exception_identifier: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'exception_type' })
  exception_type: ExceptionType | null;

  @Column({ type: 'uuid', nullable: false, name: 'entity_id' })
  entity_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'entity_type' })
  entity_type: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'requested_by' })
  requested_by: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'requested_by' })
  requester: User | null;

  @Column({ type: 'uuid', nullable: true, name: 'requesting_business_unit_id' })
  requesting_business_unit_id: string | null;

  @ManyToOne(() => BusinessUnit, { nullable: true })
  @JoinColumn({ name: 'requesting_business_unit_id' })
  requesting_business_unit: BusinessUnit | null;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'request_date' })
  request_date: Date;

  @Column({ type: 'text', nullable: false, name: 'business_justification' })
  business_justification: string;

  @Column({ type: 'text', nullable: true, name: 'compensating_controls' })
  compensating_controls: string | null;

  @Column({ type: 'text', nullable: true, name: 'risk_assessment' })
  risk_assessment: string | null;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  start_date: Date | null;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  end_date: Date | null;

  @Column({ type: 'boolean', default: true, name: 'auto_expire' })
  auto_expire: boolean;

  @Column({
    type: 'enum',
    enum: ExceptionStatus,
    default: ExceptionStatus.REQUESTED,
  })
  status: ExceptionStatus;

  @Column({ type: 'uuid', nullable: true, name: 'approved_by' })
  approved_by: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: User | null;

  @Column({ type: 'date', nullable: true, name: 'approval_date' })
  approval_date: Date | null;

  @Column({ type: 'text', nullable: true, name: 'approval_conditions' })
  approval_conditions: string | null;

  @Column({ type: 'text', nullable: true, name: 'rejection_reason' })
  rejection_reason: string | null;

  @Column({ type: 'date', nullable: true, name: 'last_review_date' })
  last_review_date: Date | null;

  @Column({ type: 'date', nullable: true, name: 'next_review_date' })
  next_review_date: Date | null;

  @Column({ type: 'jsonb', nullable: true, name: 'supporting_documents' })
  supporting_documents: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updated_by: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date | null;
}
