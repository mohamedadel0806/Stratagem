import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AssetType {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  APPLICATION = 'application',
  SOFTWARE = 'software',
  SUPPLIER = 'supplier',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Entity('asset_audit_logs')
@Index(['assetType', 'assetId'])
@Index(['action'])
@Index(['changedById'])
@Index(['createdAt'])
export class AssetAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AssetType,
    name: 'asset_type',
  })
  assetType: AssetType;

  @Column({
    type: 'uuid',
    name: 'asset_id',
  })
  assetId: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'field_name',
  })
  fieldName?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'old_value',
  })
  oldValue?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'new_value',
  })
  newValue?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'changed_by_id' })
  changedBy?: User;

  @Column({
    type: 'uuid',
    name: 'changed_by_id',
    nullable: true,
  })
  changedById?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'change_reason',
  })
  changeReason?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}








