import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ComplianceFramework } from '../../../common/entities/compliance-framework.entity';
import { User } from '../../../users/entities/user.entity';

@Entity('framework_versions')
@Index(['framework_id'])
@Index(['version'])
export class FrameworkVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'framework_id' })
  framework_id: string;

  @ManyToOne(() => ComplianceFramework, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'framework_id' })
  framework: ComplianceFramework;

  @Column({ type: 'varchar', length: 50 })
  version: string; // e.g., '1.0', '2.0', '2022'

  @Column({ type: 'text', nullable: true, name: 'version_notes' })
  version_notes: string;

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

  @Column({ type: 'date', nullable: true, name: 'effective_date' })
  effective_date: Date;

  @Column({ type: 'boolean', default: false, name: 'is_current' })
  is_current: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}


