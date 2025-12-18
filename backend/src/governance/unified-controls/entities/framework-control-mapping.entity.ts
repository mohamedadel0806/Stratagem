import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UnifiedControl } from './unified-control.entity';
import { FrameworkRequirement } from './framework-requirement.entity';
import { User } from '../../../users/entities/user.entity';

export enum MappingCoverage {
  FULL = 'full',
  PARTIAL = 'partial',
  NOT_APPLICABLE = 'not_applicable',
}

@Entity('framework_control_mappings')
@Index(['framework_requirement_id'])
@Index(['unified_control_id'])
@Index(['coverage_level'])
export class FrameworkControlMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'framework_requirement_id' })
  framework_requirement_id: string;

  @ManyToOne(() => FrameworkRequirement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'framework_requirement_id' })
  framework_requirement: FrameworkRequirement;

  @Column({ type: 'uuid', name: 'unified_control_id' })
  unified_control_id: string;

  @ManyToOne(() => UnifiedControl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unified_control_id' })
  unified_control: UnifiedControl;

  @Column({
    type: 'enum',
    enum: MappingCoverage,
    default: MappingCoverage.FULL,
    name: 'coverage_level',
  })
  coverage_level: MappingCoverage;

  @Column({ type: 'text', nullable: true, name: 'mapping_notes' })
  mapping_notes: string;

  @Column({ type: 'uuid', nullable: true, name: 'mapped_by' })
  mapped_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'mapped_by' })
  mapper: User;

  @CreateDateColumn({ name: 'mapped_at' })
  mapped_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
