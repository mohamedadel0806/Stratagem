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
import { Policy } from '../../policies/entities/policy.entity';

export enum ImplementationStatus {
  NOT_IMPLEMENTED = 'not_implemented',
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  IMPLEMENTED = 'implemented',
  NOT_APPLICABLE = 'not_applicable',
}

@Entity('control_objectives')
@Index(['policy_id'])
@Index(['objective_identifier'])
@Index(['domain'])
@Index(['responsible_party_id'])
@Index(['implementation_status'])
export class ControlObjective {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'objective_identifier' })
  objective_identifier: string;

  @Column({ type: 'uuid', name: 'policy_id' })
  policy_id: string;

  @ManyToOne(() => Policy, (policy) => policy.control_objectives, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'text' })
  statement: string;

  @Column({ type: 'text', nullable: true })
  rationale: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  domain: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  priority: string;

  @Column({ type: 'boolean', default: true })
  mandatory: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'responsible_party_id' })
  responsible_party_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'responsible_party_id' })
  responsible_party: User;

  @Column({
    type: 'enum',
    enum: ImplementationStatus,
    default: ImplementationStatus.NOT_IMPLEMENTED,
    name: 'implementation_status',
  })
  implementation_status: ImplementationStatus;

  @Column({ type: 'date', nullable: true, name: 'target_implementation_date' })
  target_implementation_date: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_implementation_date' })
  actual_implementation_date: Date;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'linked_influencers' })
  linked_influencers: string[];

  @Column({ type: 'integer', nullable: true, name: 'display_order' })
  display_order: number;

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





