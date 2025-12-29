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
import { Tenant } from '../../common/entities/tenant.entity';

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

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({
    type: 'enum',
    enum: AssetTypeEnum,
    name: 'asset_type',
  })
  assetType: AssetTypeEnum;

  @Column({ type: 'varchar', length: 100, name: 'field_name' })
  fieldName: string;

  @Column({ type: 'varchar', length: 200, name: 'display_name' })
  displayName: string;

  @Column({
    type: 'enum',
    enum: FieldType,
    name: 'field_type',
  })
  fieldType: FieldType;

  @Column({ type: 'boolean', default: false, name: 'is_required' })
  isRequired: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_enabled' })
  isEnabled: boolean;

  @Column({ type: 'int', nullable: true, name: 'display_order' })
  displayOrder: number;

  @Column({ type: 'text', nullable: true, name: 'validation_rule' })
  validationRule: string; // Regex pattern or validation expression

  @Column({ type: 'text', nullable: true, name: 'validation_message' })
  validationMessage: string; // Custom error message

  @Column({ type: 'jsonb', nullable: true, name: 'select_options' })
  selectOptions: string[]; // For select/multi-select fields

  @Column({ type: 'text', nullable: true, name: 'default_value' })
  defaultValue: string;

  @Column({ type: 'text', nullable: true, name: 'help_text' })
  helpText: string;

  @Column({ type: 'jsonb', nullable: true, name: 'field_dependencies' })
  fieldDependencies: Record<string, any>; // Conditional field logic

  @Column({ type: 'uuid', name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
