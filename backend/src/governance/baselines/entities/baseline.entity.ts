import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { ControlObjective } from '../../control-objectives/entities/control-objective.entity';

export enum BaselineStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived',
}

@Entity('secure_baselines')
@Index(['baseline_identifier'])
@Index(['status'])
@Index(['category'])
export class SecureBaseline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'baseline_identifier' })
  baseline_identifier: string;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  version: string;

  @Column({
    type: 'enum',
    enum: BaselineStatus,
    default: BaselineStatus.DRAFT,
  })
  status: BaselineStatus;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  owner_id: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User | null;

  @OneToMany(() => BaselineRequirement, (requirement) => requirement.baseline, { cascade: true })
  requirements: BaselineRequirement[];

  // Many-to-many relationship with control objectives
  @ManyToMany(() => ControlObjective)
  @JoinTable({
    name: 'baseline_control_objective_mappings',
    joinColumn: { name: 'baseline_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'control_objective_id', referencedColumnName: 'id' },
  })
  control_objectives: ControlObjective[];

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

@Entity('baseline_requirements')
@Index(['baseline_id'])
@Index(['requirement_identifier'])
export class BaselineRequirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'baseline_id' })
  baseline_id: string;

  @ManyToOne(() => SecureBaseline, (baseline) => baseline.requirements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'baseline_id' })
  baseline: SecureBaseline;

  @Column({ type: 'varchar', length: 100, name: 'requirement_identifier' })
  requirement_identifier: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true, name: 'configuration_value' })
  configuration_value: string;

  @Column({ type: 'text', nullable: true, name: 'validation_method' })
  validation_method: string;

  @Column({ type: 'integer', nullable: true, name: 'display_order' })
  display_order: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}


