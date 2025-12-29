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

export enum AssetType {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  APPLICATION = 'application',
  SOFTWARE = 'software',
  SUPPLIER = 'supplier',
  ALL = 'all',
}

export enum ValidationType {
  REQUIRED = 'required',
  REGEX = 'regex',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
  MIN_VALUE = 'min_value',
  MAX_VALUE = 'max_value',
  EMAIL = 'email',
  URL = 'url',
  DATE = 'date',
  CUSTOM = 'custom',
}

export enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
}

@Entity('validation_rules')
export class ValidationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AssetType,
    name: 'asset_type',
  })
  assetType: AssetType;

  @Column({ type: 'varchar', length: 255, name: 'field_name' })
  fieldName: string; // Field to validate

  @Column({
    type: 'enum',
    enum: ValidationType,
    name: 'validation_type',
  })
  validationType: ValidationType;

  @Column({ type: 'text', nullable: true, name: 'regex_pattern' })
  regexPattern: string; // For REGEX validation type

  @Column({ type: 'integer', nullable: true, name: 'min_length' })
  minLength: number; // For MIN_LENGTH validation type

  @Column({ type: 'integer', nullable: true, name: 'max_length' })
  maxLength: number; // For MAX_LENGTH validation type

  @Column({ type: 'numeric', nullable: true, name: 'min_value' })
  minValue: number; // For MIN_VALUE validation type

  @Column({ type: 'numeric', nullable: true, name: 'max_value' })
  maxValue: number; // For MAX_VALUE validation type

  @Column({ type: 'text', nullable: true, name: 'custom_validation_script' })
  customValidationScript: string; // For CUSTOM validation type (JavaScript)

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage: string; // Custom error message

  @Column({
    type: 'enum',
    enum: ValidationSeverity,
    default: ValidationSeverity.ERROR,
  })
  severity: ValidationSeverity;

  @Column({ type: 'jsonb', nullable: true })
  dependencies: Array<{ field: string; condition: string; value: any }>; // Field dependencies (if X then Y required)

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, name: 'apply_to_import' })
  applyToImport: boolean; // Apply during bulk imports

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
