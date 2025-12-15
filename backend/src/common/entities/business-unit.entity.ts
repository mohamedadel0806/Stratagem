import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('business_units')
@Index(['code'], { unique: true })
@Index(['parentId'])
export class BusinessUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code: string;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @ManyToOne(() => BusinessUnit, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: BusinessUnit;

  @OneToMany(() => BusinessUnit, (unit) => unit.parent)
  children: BusinessUnit[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  managerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}








