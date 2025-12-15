import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { KRI } from './kri.entity';
import { Risk } from './risk.entity';
import { User } from '../../users/entities/user.entity';

@Entity('kri_risk_links')
@Index(['kri_id'])
@Index(['risk_id'])
export class KRIRiskLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'kri_id' })
  kri_id: string;

  @ManyToOne(() => KRI, (kri) => kri.risk_links, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kri_id' })
  kri: KRI;

  @Column({ type: 'uuid', name: 'risk_id' })
  risk_id: string;

  @ManyToOne(() => Risk, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'risk_id' })
  risk: Risk;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'indicator',
    name: 'relationship_type',
  })
  relationship_type: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true, name: 'linked_by' })
  linked_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'linked_by' })
  linker: User;

  @CreateDateColumn({ name: 'linked_at' })
  linked_at: Date;
}




