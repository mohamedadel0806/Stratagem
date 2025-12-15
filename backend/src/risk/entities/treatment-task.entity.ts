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
import { RiskTreatment } from './risk-treatment.entity';
import { User } from '../../users/entities/user.entity';

@Entity('treatment_tasks')
@Index(['treatment_id'])
@Index(['status'])
export class TreatmentTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'treatment_id' })
  treatment_id: string;

  @ManyToOne(() => RiskTreatment, (treatment) => treatment.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'treatment_id' })
  treatment: RiskTreatment;

  @Column({ type: 'varchar', length: 300 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true, name: 'assignee_id' })
  assignee_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'date', nullable: true, name: 'due_date' })
  due_date: Date;

  @Column({ type: 'date', nullable: true, name: 'completed_date' })
  completed_date: Date;

  @Column({ type: 'integer', default: 0, name: 'display_order' })
  display_order: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}




