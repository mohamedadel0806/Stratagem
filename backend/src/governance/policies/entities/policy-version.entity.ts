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

@Entity('policy_versions')
@Index(['policy_id', 'version_number'])
@Index(['policy_id'])
export class PolicyVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'policy_id' })
  policy_id: string;

  @ManyToOne(() => Policy, (policy) => policy.versions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'varchar', length: 50 })
  version: string;

  @Column({ type: 'integer' })
  version_number: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  change_summary: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;
}
