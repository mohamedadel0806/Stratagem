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
import { UnifiedControl, ImplementationStatus } from './unified-control.entity';
import { User } from '../../../users/entities/user.entity';

export enum AssetType {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  APPLICATION = 'application',
  SOFTWARE = 'software',
  SUPPLIER = 'supplier',
}

@Entity('control_asset_mappings')
@Index(['unified_control_id'])
@Index(['asset_type', 'asset_id'])
@Index(['implementation_status'])
export class ControlAssetMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'unified_control_id' })
  unified_control_id: string;

  @ManyToOne(() => UnifiedControl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unified_control_id' })
  unified_control: UnifiedControl;

  @Column({ type: 'varchar', length: 100, name: 'asset_type' })
  asset_type: AssetType;

  @Column({ type: 'uuid', name: 'asset_id' })
  asset_id: string;

  @Column({ type: 'date', nullable: true, name: 'implementation_date' })
  implementation_date: Date;

  @Column({
    type: 'enum',
    enum: ImplementationStatus,
    default: ImplementationStatus.NOT_IMPLEMENTED,
    name: 'implementation_status',
  })
  implementation_status: ImplementationStatus;

  @Column({ type: 'text', nullable: true, name: 'implementation_notes' })
  implementation_notes: string;

  @Column({ type: 'date', nullable: true, name: 'last_test_date' })
  last_test_date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_test_result' })
  last_test_result: string;

  @Column({ type: 'integer', nullable: true, name: 'effectiveness_score' })
  effectiveness_score: number;

  @Column({ type: 'boolean', default: false, name: 'is_automated' })
  is_automated: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'mapped_by' })
  mapped_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'mapped_by' })
  mapper: User;

  @CreateDateColumn({ name: 'mapped_at' })
  mapped_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}




