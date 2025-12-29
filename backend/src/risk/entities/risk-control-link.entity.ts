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
import { Tenant } from '../../common/entities/tenant.entity';

@Entity('risk_control_links')
@Index(['riskId'])
@Index(['controlId'])
@Index(['effectivenessRating'])
export class RiskControlLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'uuid', name: 'risk_id' })
  riskId: string;

  @ManyToOne(() => Risk, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'risk_id' })
  risk: Risk;

  @Column({ type: 'uuid', name: 'control_id' })
  controlId: string;

  @ManyToOne(() => UnifiedControl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'control_id' })
  control: UnifiedControl;

  @Column({ type: 'integer', nullable: true, name: 'effectiveness_rating' })
  effectivenessRating: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'scale',
    name: 'effectiveness_type',
  })
  effectivenessType: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'control_type_for_risk',
  })
  controlTypeForRisk: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true, name: 'linked_by' })
  linkedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'linked_by' })
  linker: User;

  @CreateDateColumn({ name: 'linked_at' })
  linkedAt: Date;

  @Column({ type: 'date', nullable: true, name: 'last_effectiveness_review' })
  lastEffectivenessReview: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
