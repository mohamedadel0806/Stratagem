import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { BusinessUnit } from '../../../common/entities/business-unit.entity';

@Entity('governance_role_assignments')
@Index(['user_id'])
@Index(['role'])
@Index(['business_unit_id'])
@Index(['user_id', 'role'])
export class GovernanceRoleAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  role: string; // Role name (from UserRole enum or custom)

  @Column({ type: 'uuid', nullable: true, name: 'business_unit_id' })
  business_unit_id: string | null;

  @ManyToOne(() => BusinessUnit, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_unit_id' })
  business_unit: BusinessUnit | null;

  @Column({ type: 'uuid', nullable: true, name: 'assigned_by' })
  assigned_by: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_by' })
  assigner: User | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'assigned_at' })
  assigned_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expires_at: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
