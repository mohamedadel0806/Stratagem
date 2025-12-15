import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { KRI, KRIStatus } from './kri.entity';
import { User } from '../../users/entities/user.entity';

@Entity('kri_measurements')
@Index(['kri_id'])
@Index(['measurement_date'])
@Index(['kri_id', 'measurement_date'])
export class KRIMeasurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'kri_id' })
  kri_id: string;

  @ManyToOne(() => KRI, (kri) => kri.measurements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kri_id' })
  kri: KRI;

  @Column({ type: 'date', name: 'measurement_date' })
  measurement_date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  value: number;

  @Column({
    type: 'enum',
    enum: KRIStatus,
    enumName: 'kri_status',
    nullable: true,
  })
  status: KRIStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true, name: 'measured_by' })
  measured_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'measured_by' })
  measurer: User;

  @Column({ type: 'jsonb', nullable: true, name: 'evidence_attachments' })
  evidence_attachments: Record<string, any>[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}

