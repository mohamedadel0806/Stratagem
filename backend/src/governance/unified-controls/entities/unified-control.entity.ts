import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToMany,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { ControlObjective } from '../../control-objectives/entities/control-objective.entity';
import { Tenant } from '../../../common/entities/tenant.entity';

export enum ControlType {
  PREVENTIVE = 'preventive',
  DETECTIVE = 'detective',
  CORRECTIVE = 'corrective',
  COMPENSATING = 'compensating',
  ADMINISTRATIVE = 'administrative',
  TECHNICAL = 'technical',
  PHYSICAL = 'physical',
}

export enum ControlComplexity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ControlCostImpact {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ControlStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
}

export enum ImplementationStatus {
  NOT_IMPLEMENTED = 'not_implemented',
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  IMPLEMENTED = 'implemented',
  NOT_APPLICABLE = 'not_applicable',
}

@Entity('unified_controls')
@Index(['control_identifier'])
@Index(['control_type'])
@Index(['domain'])
@Index(['status'])
@Index(['implementation_status'])
@Index(['control_owner_id'])
export class UnifiedControl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  tenant_id: string;

  @ManyToOne(() => Tenant, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'control_identifier' })
  control_identifier: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ControlType,
    nullable: true,
    name: 'control_type',
  })
  control_type: ControlType;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'control_category' })
  control_category: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  domain: string;

  @Column({
    type: 'enum',
    enum: ControlComplexity,
    nullable: true,
  })
  complexity: ControlComplexity;

  @Column({
    type: 'enum',
    enum: ControlCostImpact,
    nullable: true,
    name: 'cost_impact',
  })
  cost_impact: ControlCostImpact;

  @Column({
    type: 'enum',
    enum: ControlStatus,
    default: ControlStatus.DRAFT,
  })
  status: ControlStatus;

  @Column({
    type: 'enum',
    enum: ImplementationStatus,
    default: ImplementationStatus.NOT_IMPLEMENTED,
    name: 'implementation_status',
  })
  implementation_status: ImplementationStatus;

  @Column({ type: 'uuid', nullable: true, name: 'control_owner_id' })
  control_owner_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'control_owner_id' })
  control_owner: User;

  @Column({ type: 'text', nullable: true, name: 'control_procedures' })
  control_procedures: string;

  @Column({ type: 'text', nullable: true, name: 'testing_procedures' })
  testing_procedures: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true, name: 'custom_fields' })
  custom_fields: Record<string, any>;

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

  @ManyToMany(() => ControlObjective, (objective) => objective.unified_controls)
  control_objectives: ControlObjective[];
}







