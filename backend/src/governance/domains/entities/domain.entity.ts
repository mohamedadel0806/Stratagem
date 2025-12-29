import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Tenant } from '../../../common/entities/tenant.entity';

@Entity('control_domains')
@Index(['tenantId'])
@Index(['parent_id'])
@Index(['owner_id'])
@Index(['name'])
export class ControlDomain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true, name: 'parent_id' })
  parent_id: string | null;

  @ManyToOne(() => ControlDomain, (domain) => domain.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: ControlDomain;

  @OneToMany(() => ControlDomain, (domain) => domain.parent)
  children: ControlDomain[];

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  owner_id: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  code: string; // Short code like "IAM", "NET", etc.

  @Column({ type: 'integer', default: 0 })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

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


