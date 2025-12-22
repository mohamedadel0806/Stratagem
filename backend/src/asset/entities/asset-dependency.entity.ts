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
import { User } from '../../users/entities/user.entity';

export enum AssetType {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  APPLICATION = 'application',
  SOFTWARE = 'software',
  SUPPLIER = 'supplier',
}

export enum RelationshipType {
  DEPENDS_ON = 'depends_on',
  USES = 'uses',
  CONTAINS = 'contains',
  HOSTS = 'hosts',
  PROCESSES = 'processes',
  STORES = 'stores',
  OTHER = 'other',
}

@Entity('asset_dependencies')
@Index(['sourceAssetType', 'sourceAssetId'])
@Index(['targetAssetType', 'targetAssetId'])
@Index(['relationshipType'])
@Index(['sourceAssetType', 'sourceAssetId', 'targetAssetType', 'targetAssetId'], { unique: true })
export class AssetDependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AssetType,
    name: 'source_asset_type',
  })
  sourceAssetType: AssetType;

  @Column({
    type: 'uuid',
    name: 'source_asset_id',
  })
  sourceAssetId: string;

  @Column({
    type: 'enum',
    enum: AssetType,
    name: 'target_asset_type',
  })
  targetAssetType: AssetType;

  @Column({
    type: 'uuid',
    name: 'target_asset_id',
  })
  targetAssetId: string;

  @Column({
    type: 'enum',
    enum: RelationshipType,
    name: 'relationship_type',
    default: RelationshipType.DEPENDS_ON,
  })
  relationshipType: RelationshipType;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: User;

  @Column({
    type: 'uuid',
    name: 'created_by_id',
    nullable: true,
  })
  createdById?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}











