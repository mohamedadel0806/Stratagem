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

export enum RiskAssetType {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  SOFTWARE = 'software',
  APPLICATION = 'application',
  SUPPLIER = 'supplier',
}

@Entity('risk_asset_links')
@Index(['risk_id'])
@Index(['asset_type', 'asset_id'])
export class RiskAssetLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'risk_id' })
  risk_id: string;

  @ManyToOne(() => Risk, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'risk_id' })
  risk: Risk;

  @Column({
    type: 'enum',
    enum: RiskAssetType,
    name: 'asset_type',
  })
  asset_type: RiskAssetType;

  @Column({ type: 'uuid', name: 'asset_id' })
  asset_id: string;

  @Column({ type: 'text', nullable: true, name: 'impact_description' })
  impact_description: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'asset_criticality_at_link',
  })
  asset_criticality_at_link: string;

  @Column({ type: 'uuid', nullable: true, name: 'linked_by' })
  linked_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'linked_by' })
  linker: User;

  @CreateDateColumn({ name: 'linked_at' })
  linked_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}







