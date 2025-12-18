import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ComplianceFramework } from '../../../common/entities/compliance-framework.entity';

@Entity('framework_requirements')
@Index(['framework_id'])
@Index(['requirement_identifier'])
@Index(['domain', 'category'])
export class FrameworkRequirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'framework_id' })
  framework_id: string;

  @ManyToOne(() => ComplianceFramework, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'framework_id' })
  framework: ComplianceFramework;

  @Column({ type: 'varchar', length: 100, name: 'requirement_identifier' })
  requirement_identifier: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  title: string;

  @Column({ type: 'text', name: 'requirement_text' })
  requirement_text: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  domain: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  subcategory: string;

  @Column({ type: 'integer', nullable: true, name: 'display_order' })
  display_order: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
