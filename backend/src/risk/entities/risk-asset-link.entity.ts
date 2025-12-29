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
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../common/entities/tenant.entity';

export enum RiskAssetType {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  SOFTWARE = 'software',
  APPLICATION = 'application',
  SUPPLIER = 'supplier',
}

@Entity('risk_asset_links')
@Index(['riskId'])
@Index(['assetType', 'assetId'])
export class RiskAssetLink {
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

  @Column({
    type: 'enum',
    enum: RiskAssetType,
    name: 'asset_type',
  })
  assetType: RiskAssetType;

  @Column({ type: 'uuid', name: 'asset_id' })
  assetId: string;

  @Column({ type: 'text', nullable: true, name: 'impact_description' })
  impactDescription: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'asset_criticality_at_link',
  })
  assetCriticalityAtLink: string;

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
