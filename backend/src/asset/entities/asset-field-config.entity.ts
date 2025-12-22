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

export enum AssetTypeEnum {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  APPLICATION = 'application',
  SOFTWARE = 'software',
  SUPPLIER = 'supplier',
}

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  TEXTAREA = 'textarea',
  EMAIL = 'email',
  URL = 'url',
}

@Entity('asset_field_configs')
@Index(['assetType', 'fieldName'], { unique: true })
export class AssetFieldConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AssetTypeEnum,
  })
  assetType: AssetTypeEnum;

  @Column({ type: 'varchar', length: 100 })
  fieldName: string;

  @Column({ type: 'varchar', length: 200 })
  displayName: string;

  @Column({
    type: 'enum',
    enum: FieldType,
  })
  fieldType: FieldType;

  @Column({ type: 'boolean', default: false })
  isRequired: boolean;

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ type: 'int', nullable: true })
  displayOrder: number;

  @Column({ type: 'text', nullable: true })
  validationRule: string; // Regex pattern or validation expression

  @Column({ type: 'text', nullable: true })
  validationMessage: string; // Custom error message

  @Column({ type: 'jsonb', nullable: true })
  selectOptions: string[]; // For select/multi-select fields

  @Column({ type: 'text', nullable: true })
  defaultValue: string;

  @Column({ type: 'text', nullable: true })
  helpText: string;

  @Column({ type: 'jsonb', nullable: true })
  fieldDependencies: Record<string, any>; // Conditional field logic

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}











