import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AssetType,
  })
  assetType: AssetType;

  @Column({ type: 'varchar', length: 255 })
  fieldName: string; // Field to validate

  @Column({
    type: 'enum',
    enum: ValidationType,
  })
  validationType: ValidationType;

  @Column({ type: 'text', nullable: true })
  regexPattern: string; // For REGEX validation type

  @Column({ type: 'integer', nullable: true })
  minLength: number; // For MIN_LENGTH validation type

  @Column({ type: 'integer', nullable: true })
  maxLength: number; // For MAX_LENGTH validation type

  @Column({ type: 'numeric', nullable: true })
  minValue: number; // For MIN_VALUE validation type

  @Column({ type: 'numeric', nullable: true })
  maxValue: number; // For MAX_VALUE validation type

  @Column({ type: 'text', nullable: true })
  customValidationScript: string; // For CUSTOM validation type (JavaScript)

  @Column({ type: 'text', nullable: true })
  errorMessage: string; // Custom error message

  @Column({
    type: 'enum',
    enum: ValidationSeverity,
    default: ValidationSeverity.ERROR,
  })
  severity: ValidationSeverity;

  @Column({ type: 'jsonb', nullable: true })
  dependencies: Array<{ field: string; condition: string; value: any }>; // Field dependencies (if X then Y required)

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  applyToImport: boolean; // Apply during bulk imports

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



