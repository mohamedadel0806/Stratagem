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
import { Finding } from '../../governance/findings/entities/finding.entity';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum RiskFindingRelationshipType {
  IDENTIFIED = 'identified',
  CONTRIBUTES_TO = 'contributes_to',
  MITIGATES = 'mitigates',
  EXACERBATES = 'exacerbates',
  RELATED = 'related',
}

@Entity('risk_finding_links')
@Index(['riskId'])
@Index(['findingId'])
@Index(['relationshipType'])
export class RiskFindingLink {
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

  @Column({ type: 'uuid', name: 'finding_id' })
  findingId: string;

  @ManyToOne(() => Finding, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'finding_id' })
  finding: Finding;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'relationship_type',
  })
  relationshipType: RiskFindingRelationshipType;

  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes: string;

  @Column({ type: 'uuid', nullable: true, name: 'linked_by' })
  linkedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'linked_by' })
  linker: User;

  @CreateDateColumn({ name: 'linked_at' })
  linkedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
