import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ComplianceRequirement } from './compliance-requirement.entity';

@Entity('compliance_frameworks')
export class ComplianceFramework {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'code' })
  code: string; // e.g., 'NCA', 'SAMA', 'ADGM'

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'region' })
  region: string; // e.g., 'Saudi Arabia', 'UAE', 'Egypt'

  @Column({ type: 'uuid', nullable: true, name: 'organizationId' })
  organizationId: string;

  @OneToMany(
    () => ComplianceRequirement,
    (requirement) => requirement.framework,
  )
  requirements: ComplianceRequirement[];

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

