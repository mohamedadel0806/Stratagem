import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  COMPLIANCE_OFFICER = 'compliance_officer',
  RISK_MANAGER = 'risk_manager',
  AUDITOR = 'auditor',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, name: 'avatarUrl' })
  avatarUrl: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Index()
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @Index()
  status: UserStatus;

  @Column({ default: false, name: 'email_verified' })
  emailVerified: boolean;

  @Column({ default: false, name: 'phone_verified' })
  phoneVerified: boolean;

  @Column({ nullable: true, name: 'last_login_at' })
  lastLoginAt: Date;

  @Column({ nullable: true, name: 'password_changed_at' })
  passwordChangedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}