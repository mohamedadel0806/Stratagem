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
import { Tenant } from '../../common/entities/tenant.entity';

export enum ImportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

export enum ImportFileType {
  CSV = 'csv',
  EXCEL = 'excel',
}

@Entity('import_logs')
export class ImportLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  @Index()
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255, name: 'file_name' })
  fileName: string;

  @Column({
    type: 'enum',
    enum: ImportFileType,
    name: 'file_type',
  })
  fileType: ImportFileType;

  @Column({ type: 'varchar', length: 50, name: 'asset_type' })
  assetType: string; // 'physical', 'information', etc.

  @Column({
    type: 'enum',
    enum: ImportStatus,
    default: ImportStatus.PENDING,
    name: 'status',
  })
  status: ImportStatus;

  @Column({ type: 'int', default: 0, name: 'total_records' })
  totalRecords: number;

  @Column({ type: 'int', default: 0, name: 'successful_imports' })
  successfulImports: number;

  @Column({ type: 'int', default: 0, name: 'failed_imports' })
  failedImports: number;

  @Column({ type: 'text', nullable: true, name: 'error_report' })
  errorReport: string; // JSON array of errors

  @Column({ type: 'jsonb', nullable: true, name: 'field_mapping' })
  fieldMapping: Record<string, string>; // CSV column -> Asset field mapping

  @Column({ type: 'uuid', name: 'imported_by_id', nullable: false })
  importedById: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'imported_by_id' })
  importedBy: User;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt: Date;
}
