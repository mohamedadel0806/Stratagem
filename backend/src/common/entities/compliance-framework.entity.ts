import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ComplianceRequirement } from './compliance-requirement.entity';
import { User } from '../../users/entities/user.entity';

export enum FrameworkStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  DEPRECATED = 'deprecated',
}

@Entity('compliance_frameworks')
@Index(['framework_code'])
@Index(['status'])
export class ComplianceFramework {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'framework_code' })
  framework_code: string; // e.g., 'NCA_ECC', 'ISO27001', 'PCI_DSS'

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string; // e.g., '1.0', '2022', '4.0'

  @Column({ type: 'varchar', length: 300, nullable: true, name: 'issuing_authority' })
  issuing_authority: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true, name: 'effective_date' })
  effective_date: Date;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({
    type: 'enum',
    enum: FrameworkStatus,
    default: FrameworkStatus.ACTIVE,
  })
  status: FrameworkStatus;

  @Column({ type: 'jsonb', nullable: true })
  structure: {
    domains?: Array<{
      name: string;
      categories?: Array<{
        name: string;
        requirements?: Array<{
          identifier: string;
          title: string;
          text: string;
        }>;
      }>;
    }>;
  };

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

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

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deleted_at: Date;

  // Legacy fields for backward compatibility
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'code' })
  code: string; // Alias for framework_code

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'region' })
  region: string; // e.g., 'Saudi Arabia', 'UAE', 'Egypt'

  @Column({ type: 'uuid', nullable: true, name: 'organizationId' })
  organizationId: string;

  @OneToMany(
    () => ComplianceRequirement,
    (requirement) => requirement.framework,
  )
  requirements: ComplianceRequirement[];
}

