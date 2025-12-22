import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Evidence } from './evidence.entity';

export enum EvidenceLinkType {
  CONTROL = 'control',
  ASSESSMENT = 'assessment',
  FINDING = 'finding',
  ASSET = 'asset',
  POLICY = 'policy',
  STANDARD = 'standard',
}

@Entity('evidence_linkages')
@Index(['evidence_id'])
@Index(['link_type', 'linked_entity_id'])
export class EvidenceLinkage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'evidence_id' })
  evidence_id: string;

  @ManyToOne(() => Evidence, (evidence) => evidence.linkages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'evidence_id' })
  evidence: Evidence;

  @Column({
    type: 'enum',
    enum: EvidenceLinkType,
    name: 'link_type',
  })
  link_type: EvidenceLinkType;

  @Column({ type: 'uuid', name: 'linked_entity_id' })
  linked_entity_id: string;

  @Column({ type: 'text', nullable: true, name: 'link_description' })
  link_description: string;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}







