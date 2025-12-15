import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AssetCategory {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  APPLICATION = 'application',
  SOFTWARE = 'software',
  SUPPLIER = 'supplier',
}

@Entity('asset_types')
@Index(['category'])
export class AssetType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AssetCategory,
    nullable: false,
  })
  category: AssetCategory;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

