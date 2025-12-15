import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @Column({ type: 'varchar', length: 255, name: 'fileName' })
  fileName: string;

  @Column({
    type: 'enum',
    enum: ImportFileType,
    name: 'fileType',
  })
  fileType: ImportFileType;

  @Column({ type: 'varchar', length: 50, name: 'assetType' })
  assetType: string; // 'physical', 'information', etc.

  @Column({
    type: 'enum',
    enum: ImportStatus,
    default: ImportStatus.PENDING,
    name: 'status',
  })
  status: ImportStatus;

  @Column({ type: 'int', default: 0, name: 'totalRecords' })
  totalRecords: number;

  @Column({ type: 'int', default: 0, name: 'successfulImports' })
  successfulImports: number;

  @Column({ type: 'int', default: 0, name: 'failedImports' })
  failedImports: number;

  @Column({ type: 'text', nullable: true, name: 'errorReport' })
  errorReport: string; // JSON array of errors

  @Column({ type: 'jsonb', nullable: true, name: 'fieldMapping' })
  fieldMapping: Record<string, string>; // CSV column -> Asset field mapping

  @Column({ type: 'uuid', name: 'importedById', nullable: false })
  importedById: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'importedById' })
  importedBy: User;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completedAt' })
  completedAt: Date;
}

