import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum RiskTolerance {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('risk_categories')
@Index(['code'], { unique: true })
@Index(['parent_category_id'])
@Index(['is_active'])
@Index(['display_order'])
export class RiskCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true, name: 'parent_category_id' })
  parent_category_id: string;

  @ManyToOne(() => RiskCategory, { nullable: true })
  @JoinColumn({ name: 'parent_category_id' })
  parent_category: RiskCategory;

  @OneToMany(() => RiskCategory, (category) => category.parent_category)
  sub_categories: RiskCategory[];

  @Column({
    type: 'enum',
    enum: RiskTolerance,
    default: RiskTolerance.MEDIUM,
    name: 'risk_tolerance',
  })
  risk_tolerance: RiskTolerance;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @Column({ type: 'integer', default: 0, name: 'display_order' })
  display_order: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  color: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string;

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





