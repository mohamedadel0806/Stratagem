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
import { BusinessUnit } from '../../../common/entities/business-unit.entity';

@Entity('policy_assignments')
@Index(['policy_id'])
@Index(['user_id'])
@Index(['role'])
@Index(['business_unit_id'])
@Index(['acknowledged'])
@Index(['user_id', 'policy_id'])
export class PolicyAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'policy_id' })
  policy_id: string;

  @ManyToOne(() => Policy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  user_id: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  role: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'business_unit_id' })
  business_unit_id: string | null;

  @ManyToOne(() => BusinessUnit, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_unit_id' })
  business_unit: BusinessUnit | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'assigned_at' })
  assigned_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'assigned_by' })
  assigned_by: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_by' })
  assigner: User | null;

  @Column({ type: 'boolean', default: false, name: 'notification_sent' })
  notification_sent: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'notification_sent_at' })
  notification_sent_at: Date | null;

  @Column({ type: 'boolean', default: false })
  acknowledged: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'acknowledged_at' })
  acknowledged_at: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
