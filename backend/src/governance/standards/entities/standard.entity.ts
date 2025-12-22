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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Policy } from '../../policies/entities/policy.entity';
import { ControlObjective } from '../../control-objectives/entities/control-objective.entity';

export enum StandardStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('standards')
@Index(['standard_identifier'])
@Index(['policy_id'])
@Index(['control_objective_id'])
@Index(['owner_id'])
@Index(['status'])
export class Standard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'standard_identifier' })
  standard_identifier: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'uuid', nullable: true, name: 'policy_id' })
  policy_id: string;

  @ManyToOne(() => Policy, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'uuid', nullable: true, name: 'control_objective_id' })
  control_objective_id: string;

  @ManyToOne(() => ControlObjective, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'control_objective_id' })
  control_objective: ControlObjective;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  scope: string;

  @Column({ type: 'text', nullable: true })
  applicability: string;

  @Column({ type: 'text', nullable: true, name: 'compliance_measurement_criteria' })
  compliance_measurement_criteria: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: StandardStatus.DRAFT,
  })
  status: StandardStatus;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  owner_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

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

  // Many-to-many relationship with control objectives
  @ManyToMany(() => ControlObjective)
  @JoinTable({
    name: 'standard_control_objective_mappings',
    joinColumn: { name: 'standard_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'control_objective_id', referencedColumnName: 'id' },
  })
  control_objectives: ControlObjective[];
}


