import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Policy } from './policy.entity';
import { User } from '../../../users/entities/user.entity';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVOKED = 'revoked',
}

@Entity('policy_approvals')
@Index(['policy_id', 'approval_status'])
@Index(['approver_id'])
@Index(['approval_status'])
export class PolicyApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'policy_id' })
  policy_id: string;

  @ManyToOne(() => Policy, (policy) => policy.approvals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'uuid', name: 'approver_id' })
  approver_id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'approver_id' })
  approver: User;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  approval_status: ApprovalStatus;

  @Column({ type: 'integer' })
  sequence_order: number; // Order in approval chain

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'approved_at' })
  approved_at: Date;
}
