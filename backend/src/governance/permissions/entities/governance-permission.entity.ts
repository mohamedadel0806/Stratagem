import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../../common/entities/tenant.entity';

export enum GovernanceModule {
  INFLUENCERS = 'influencers',
  POLICIES = 'policies',
  STANDARDS = 'standards',
  CONTROLS = 'controls',
  ASSESSMENTS = 'assessments',
  EVIDENCE = 'evidence',
  FINDINGS = 'findings',
  SOPS = 'sops',
  REPORTING = 'reporting',
  ADMIN = 'admin',
}

export enum GovernanceAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  PUBLISH = 'publish',
  APPROVE = 'approve',
  ASSIGN = 'assign',
  EXPORT = 'export',
  CONFIGURE = 'configure',
}

@Entity('governance_permissions')
@Index(['role'])
@Index(['module'])
@Index(['role', 'module', 'action'])
export class GovernancePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 50 })
  role: string; // UserRole enum value or custom role name

  @Column({
    type: 'enum',
    enum: GovernanceModule,
  })
  module: GovernanceModule;

  @Column({
    type: 'enum',
    enum: GovernanceAction,
  })
  action: GovernanceAction;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'resource_type' })
  resource_type: string | null; // Optional: specific resource type within module

  @Column({ type: 'jsonb', nullable: true })
  conditions: Record<string, any> | null; // Row-level security conditions (e.g., { business_unit_id: 'user.business_unit_id' })

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
