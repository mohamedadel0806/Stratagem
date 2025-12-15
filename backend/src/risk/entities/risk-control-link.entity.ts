import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Risk } from './risk.entity';
import { UnifiedControl } from '../../governance/unified-controls/entities/unified-control.entity';
import { User } from '../../users/entities/user.entity';

@Entity('risk_control_links')
@Index(['risk_id'])
@Index(['control_id'])
@Index(['effectiveness_rating'])
export class RiskControlLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'risk_id' })
  risk_id: string;

  @ManyToOne(() => Risk, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'risk_id' })
  risk: Risk;

  @Column({ type: 'uuid', name: 'control_id' })
  control_id: string;

  @ManyToOne(() => UnifiedControl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'control_id' })
  control: UnifiedControl;

  @Column({ type: 'integer', nullable: true, name: 'effectiveness_rating' })
  effectiveness_rating: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'scale',
    name: 'effectiveness_type',
  })
  effectiveness_type: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'control_type_for_risk',
  })
  control_type_for_risk: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true, name: 'linked_by' })
  linked_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'linked_by' })
  linker: User;

  @CreateDateColumn({ name: 'linked_at' })
  linked_at: Date;

  @Column({ type: 'date', nullable: true, name: 'last_effectiveness_review' })
  last_effectiveness_review: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}




