# Phase 1 Entity Design Guide - Story 7.1, 2.1, and 3.1

## Overview
This document defines the database entity structures, data models, and relationships for Phase 1 critical governance components.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Governance Framework (7.1)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ GovernanceFrameworkConfig (NEW)                          │   │
│  │ ├─ id (UUID, PK)                                        │   │
│  │ ├─ name (string)                                        │   │
│  │ ├─ description (text)                                   │   │
│  │ ├─ framework_type (enum: ISO27001, NIST, Custom, etc.) │   │
│  │ ├─ scope (string) - what areas it covers               │   │
│  │ ├─ is_active (boolean) - active/inactive                │   │
│  │ ├─ linked_framework_id (FK → ComplianceFramework)      │   │
│  │ ├─ policy_template_id (FK → Policy template)           │   │
│  │ ├─ control_template_id (FK → Control template)         │   │
│  │ ├─ metadata (jsonb) - config options                    │   │
│  │ ├─ created_by, updated_by (UUIDs)                      │   │
│  │ └─ created_at, updated_at (timestamps)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴──────────────┐
                │                            │
        ┌───────────────────┐        ┌──────────────────┐
        │ Policy Entity     │        │ Control Entity   │
        │ (Story 2.1)       │        │ (Story 3.1)      │
        └───────────────────┘        └──────────────────┘
                │                            │
        ┌───────────────────┐        ┌──────────────────┐
        │ Policy Template   │        │ Control Template │
        │ (from framework)  │        │ (from framework) │
        └───────────────────┘        └──────────────────┘
```

---

## 1. Governance Framework Configuration (Story 7.1)

### Purpose
Configure and manage compliance frameworks at the organizational level. This is the foundation that policies and controls are built upon.

### Entity: `GovernanceFrameworkConfig`

```typescript
@Entity('governance_framework_configs')
export class GovernanceFrameworkConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string; // e.g., "UAE NCA Compliance Framework"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: FrameworkType,
    default: FrameworkType.CUSTOM,
  })
  framework_type: FrameworkType;
  // ENUM: ISO27001, NIST_CYBERSECURITY, NIST_PRIVACY, PCI_DSS, GDPR, NCA_ECC, CUSTOM

  @Column({ type: 'text', nullable: true })
  scope: string; // "All departments", "Finance & IT", etc.

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'linked_framework_id' })
  linked_framework_id: string; // Reference to ComplianceFramework for structure

  @ManyToOne(() => ComplianceFramework, { nullable: true })
  @JoinColumn({ name: 'linked_framework_id' })
  linked_framework: ComplianceFramework;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    // Configuration options
    require_policy_approval?: boolean;
    require_control_testing?: boolean;
    policy_review_frequency?: string; // 'annual', 'bi-annual', 'quarterly'
    control_review_frequency?: string;
    risk_assessment_required?: boolean;
    audit_required?: boolean;
    integration_points?: string[]; // e.g., ['audit', 'risk', 'compliance']
  };

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updated_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  // Relationships
  @OneToMany(
    () => Policy,
    (policy) => policy.framework_config,
    { eager: false }
  )
  policies: Policy[];

  @OneToMany(
    () => UnifiedControl,
    (control) => control.framework_config,
    { eager: false }
  )
  controls: UnifiedControl[];
}
```

### Enum: `FrameworkType`

```typescript
export enum FrameworkType {
  ISO27001 = 'iso27001',
  NIST_CYBERSECURITY = 'nist_cybersecurity',
  NIST_PRIVACY = 'nist_privacy',
  PCI_DSS = 'pci_dss',
  GDPR = 'gdpr',
  NCA_ECC = 'nca_ecc', // UAE NCA Essential Cyber Controls
  SOC2 = 'soc2',
  HIPAA = 'hipaa',
  CUSTOM = 'custom',
}
```

### Database Migration

```sql
CREATE TABLE governance_framework_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  framework_type VARCHAR(50) NOT NULL DEFAULT 'custom',
  scope TEXT,
  is_active BOOLEAN DEFAULT true,
  linked_framework_id UUID REFERENCES compliance_frameworks(id) ON DELETE SET NULL,
  metadata JSONB,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  CONSTRAINT check_active_status CHECK (is_active IN (true, false)),
  INDEX idx_framework_type (framework_type),
  INDEX idx_is_active (is_active),
  INDEX idx_created_by (created_by)
);
```

---

## 2. Policy Entity (Story 2.1)

### Purpose
Core policy management entity. Policies define organizational requirements, standards, and expectations.

### Entity: `Policy`

```typescript
export enum PolicyStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum PolicyType {
  STRATEGIC = 'strategic',
  OPERATIONAL = 'operational',
  PROCEDURAL = 'procedural',
  COMPLIANCE = 'compliance',
  SECURITY = 'security',
}

@Entity('policies')
@Index(['policy_code'])
@Index(['status'])
@Index(['owner_id'])
@Index(['framework_config_id'])
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'policy_code' })
  policy_code: string; // e.g., 'POL-SEC-001', 'POL-ACC-002'

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  content: string; // Full policy document

  @Column({
    type: 'enum',
    enum: PolicyStatus,
    default: PolicyStatus.DRAFT,
  })
  status: PolicyStatus;

  @Column({
    type: 'enum',
    enum: PolicyType,
    default: PolicyType.OPERATIONAL,
  })
  policy_type: PolicyType;

  @Column({ type: 'uuid', nullable: true, name: 'framework_config_id' })
  framework_config_id: string; // Which framework config this belongs to

  @ManyToOne(() => GovernanceFrameworkConfig, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'framework_config_id' })
  framework_config: GovernanceFrameworkConfig;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  owner_id: string; // Policy owner/responsible person

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  version: string; // e.g., '1.0', '2.1'

  @Column({ type: 'integer', default: 1, name: 'version_number' })
  version_number: number;

  @Column({ type: 'date', nullable: true, name: 'effective_date' })
  effective_date: Date;

  @Column({ type: 'date', nullable: true, name: 'review_date' })
  review_date: Date; // Next review date

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'review_frequency' })
  review_frequency: string; // 'annual', 'bi-annual', 'quarterly', 'monthly'

  @Column({ type: 'text', nullable: true, name: 'scope' })
  scope: string; // Who/what this policy applies to

  @Column({ type: 'text', nullable: true, name: 'impact_analysis' })
  impact_analysis: string; // Business impact of policy

  @Column({ type: 'uuid', array: true, nullable: true, name: 'related_control_ids' })
  related_control_ids: string[]; // Control IDs that implement this policy

  @Column({ type: 'uuid', array: true, nullable: true, name: 'related_sop_ids' })
  related_sop_ids: string[]; // SOPs that operationalize this policy

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[]; // For categorization

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    approval_required?: boolean;
    approval_chain?: string[]; // User IDs who must approve
    risk_level?: 'low' | 'medium' | 'high' | 'critical';
    compliance_domains?: string[]; // Which compliance domains this addresses
    business_units?: string[]; // Which BUs are affected
  };

  // Audit fields
  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updated_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  // Relationships
  @OneToMany(
    () => PolicyAssignment,
    (assignment) => assignment.policy,
    { cascade: ['remove'] }
  )
  assignments: PolicyAssignment[];

  @OneToMany(
    () => PolicyVersion,
    (version) => version.policy,
    { cascade: ['remove'] }
  )
  versions: PolicyVersion[];

  @OneToMany(
    () => PolicyApproval,
    (approval) => approval.policy,
    { cascade: ['remove'] }
  )
  approvals: PolicyApproval[];
}
```

### Supporting Entity: `PolicyAssignment`

```typescript
@Entity('policy_assignments')
@Index(['policy_id', 'user_id'])
@Index(['policy_id', 'business_unit_id'])
export class PolicyAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'policy_id' })
  policy_id: string;

  @ManyToOne(() => Policy, (policy) => policy.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: true, name: 'business_unit_id' })
  business_unit_id: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assigned_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'assigned_by' })
  assigned_by: string;

  @Column({ type: 'boolean', default: false })
  acknowledged: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'acknowledged_at' })
  acknowledged_at: Date;
}
```

### Supporting Entity: `PolicyVersion`

```typescript
@Entity('policy_versions')
@Index(['policy_id', 'version_number'])
export class PolicyVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'policy_id' })
  policy_id: string;

  @ManyToOne(() => Policy, (policy) => policy.versions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'varchar', length: 50 })
  version: string;

  @Column({ type: 'integer' })
  version_number: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  change_summary: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;
}
```

### Supporting Entity: `PolicyApproval`

```typescript
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVOKED = 'revoked',
}

@Entity('policy_approvals')
@Index(['policy_id', 'approval_status'])
export class PolicyApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'policy_id' })
  policy_id: string;

  @ManyToOne(() => Policy, (policy) => policy.approvals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'uuid', name: 'approver_id' })
  approver_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approver_id' })
  approver: User;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  approval_status: ApprovalStatus;

  @Column({ type: 'integer' })
  sequence_order: number; // Order in approval chain

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'approved_at' })
  approved_at: Date;
}
```

---

## 3. Control Entity (Story 3.1)

### Purpose
Unified controls that implement policies and address compliance requirements.

### Entity: `UnifiedControl`

```typescript
export enum ControlStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum ControlType {
  PREVENTIVE = 'preventive',
  DETECTIVE = 'detective',
  CORRECTIVE = 'corrective',
  COMPENSATING = 'compensating',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('unified_controls')
@Index(['control_code'])
@Index(['status'])
@Index(['owner_id'])
@Index(['framework_config_id'])
@Index(['risk_level'])
export class UnifiedControl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'control_code' })
  control_code: string; // e.g., 'CTL-SEC-001', 'CTL-ACC-002'

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ControlStatus,
    default: ControlStatus.DRAFT,
  })
  status: ControlStatus;

  @Column({
    type: 'enum',
    enum: ControlType,
    default: ControlType.PREVENTIVE,
  })
  control_type: ControlType;

  @Column({ type: 'uuid', nullable: true, name: 'framework_config_id' })
  framework_config_id: string;

  @ManyToOne(() => GovernanceFrameworkConfig, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'framework_config_id' })
  framework_config: GovernanceFrameworkConfig;

  @Column({ type: 'uuid', nullable: true, name: 'policy_id' })
  policy_id: string; // Which policy this implements

  @ManyToOne(() => Policy, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  owner_id: string; // Control owner

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.MEDIUM,
    name: 'risk_level',
  })
  risk_level: RiskLevel;

  @Column({ type: 'text', nullable: true })
  objective: string; // What this control achieves

  @Column({ type: 'text', nullable: true })
  implementation_approach: string; // How to implement

  @Column({ type: 'text', nullable: true })
  testing_approach: string; // How to test effectiveness

  @Column({ type: 'varchar', length: 100, nullable: true })
  frequency: string; // How often control is executed/tested

  @Column({ type: 'date', nullable: true, name: 'last_tested_date' })
  last_tested_date: Date;

  @Column({ type: 'date', nullable: true, name: 'next_test_date' })
  next_test_date: Date;

  @Column({ type: 'text', nullable: true })
  test_results_summary: string;

  @Column({ type: 'boolean', default: false, name: 'is_effective' })
  is_effective: boolean; // Based on test results

  @Column({ type: 'uuid', array: true, nullable: true, name: 'related_sop_ids' })
  related_sop_ids: string[]; // SOPs that support this control

  @Column({ type: 'uuid', array: true, nullable: true, name: 'related_requirement_ids' })
  related_requirement_ids: string[]; // Framework requirements it addresses

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    responsible_departments?: string[];
    control_owner_role?: string;
    evidence_location?: string;
    evidence_type?: string[];
    assessment_frequency?: string;
    maturity_level?: 'initial' | 'repeatable' | 'defined' | 'managed' | 'optimized';
  };

  // Audit fields
  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updated_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  // Relationships
  @OneToMany(
    () => ControlAssignment,
    (assignment) => assignment.control,
    { cascade: ['remove'] }
  )
  assignments: ControlAssignment[];

  @OneToMany(
    () => ControlTestResult,
    (result) => result.control,
    { cascade: ['remove'] }
  )
  test_results: ControlTestResult[];

  @ManyToMany(() => SOP, (sop) => sop.controls)
  sops: SOP[];
}
```

### Supporting Entity: `ControlAssignment`

```typescript
@Entity('control_assignments')
@Index(['control_id', 'owner_id'])
export class ControlAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'control_id' })
  control_id: string;

  @ManyToOne(() => UnifiedControl, (control) => control.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'control_id' })
  control: UnifiedControl;

  @Column({ type: 'uuid', name: 'owner_id' })
  owner_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assigned_at: Date;

  @Column({ type: 'uuid', nullable: true, name: 'assigned_by' })
  assigned_by: string;
}
```

### Supporting Entity: `ControlTestResult`

```typescript
export enum TestStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  INCONCLUSIVE = 'inconclusive',
}

@Entity('control_test_results')
@Index(['control_id', 'test_date'])
export class ControlTestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'control_id' })
  control_id: string;

  @ManyToOne(() => UnifiedControl, (control) => control.test_results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'control_id' })
  control: UnifiedControl;

  @CreateDateColumn({ name: 'test_date' })
  test_date: Date;

  @Column({ type: 'uuid', name: 'tested_by' })
  tested_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'tested_by' })
  tester: User;

  @Column({
    type: 'enum',
    enum: TestStatus,
  })
  status: TestStatus;

  @Column({ type: 'text', nullable: true })
  findings: string;

  @Column({ type: 'text', nullable: true })
  remediation_plan: string;

  @Column({ type: 'integer', nullable: true })
  effectiveness_rating: number; // 1-5 scale

  @Column({ type: 'jsonb', nullable: true })
  evidence: {
    documents?: string[];
    screenshots?: string[];
    logs?: string[];
    audit_trail?: string;
  };
}
```

---

## Database Migrations

### Migration 1: Create GovernanceFrameworkConfig

```sql
CREATE TABLE governance_framework_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  framework_type VARCHAR(50) NOT NULL DEFAULT 'custom',
  scope TEXT,
  is_active BOOLEAN DEFAULT true,
  linked_framework_id UUID REFERENCES compliance_frameworks(id) ON DELETE SET NULL,
  metadata JSONB,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  INDEX idx_framework_type (framework_type),
  INDEX idx_is_active (is_active),
  INDEX idx_created_by (created_by)
);
```

### Migration 2: Create Policy Tables

```sql
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_code VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  policy_type VARCHAR(50) DEFAULT 'operational',
  framework_config_id UUID REFERENCES governance_framework_configs(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  version VARCHAR(100),
  version_number INTEGER DEFAULT 1,
  effective_date DATE,
  review_date DATE,
  review_frequency VARCHAR(50),
  scope TEXT,
  impact_analysis TEXT,
  related_control_ids UUID[],
  related_sop_ids UUID[],
  tags VARCHAR(255)[],
  metadata JSONB,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  INDEX idx_policy_code (policy_code),
  INDEX idx_status (status),
  INDEX idx_owner_id (owner_id),
  INDEX idx_framework_config_id (framework_config_id)
);

CREATE TABLE policy_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_unit_id UUID,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP,
  
  INDEX idx_policy_user (policy_id, user_id),
  INDEX idx_policy_bu (policy_id, business_unit_id)
);

CREATE TABLE policy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  change_summary TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_policy_version (policy_id, version_number)
);

CREATE TABLE policy_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  approval_status VARCHAR(50) DEFAULT 'pending',
  sequence_order INTEGER NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  
  INDEX idx_policy_approver (policy_id, approval_status)
);
```

### Migration 3: Create Control Tables

```sql
CREATE TABLE unified_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_code VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  control_type VARCHAR(50) DEFAULT 'preventive',
  framework_config_id UUID REFERENCES governance_framework_configs(id) ON DELETE SET NULL,
  policy_id UUID REFERENCES policies(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  risk_level VARCHAR(50) DEFAULT 'medium',
  objective TEXT,
  implementation_approach TEXT,
  testing_approach TEXT,
  frequency VARCHAR(100),
  last_tested_date DATE,
  next_test_date DATE,
  test_results_summary TEXT,
  is_effective BOOLEAN DEFAULT false,
  related_sop_ids UUID[],
  related_requirement_ids UUID[],
  tags VARCHAR(255)[],
  metadata JSONB,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  INDEX idx_control_code (control_code),
  INDEX idx_status (status),
  INDEX idx_owner_id (owner_id),
  INDEX idx_framework_config_id (framework_config_id),
  INDEX idx_risk_level (risk_level)
);

CREATE TABLE control_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id UUID NOT NULL REFERENCES unified_controls(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  responsibilities TEXT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID,
  
  INDEX idx_control_owner (control_id, owner_id)
);

CREATE TABLE control_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id UUID NOT NULL REFERENCES unified_controls(id) ON DELETE CASCADE,
  test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  findings TEXT,
  remediation_plan TEXT,
  effectiveness_rating INTEGER,
  evidence JSONB,
  
  INDEX idx_control_test_date (control_id, test_date)
);
```

---

## API Endpoints (Phase 1)

### Framework Configuration APIs (Story 7.1)

```
POST   /api/governance/frameworks - Create framework config
GET    /api/governance/frameworks - List framework configs
GET    /api/governance/frameworks/:id - Get framework config
PUT    /api/governance/frameworks/:id - Update framework config
DELETE /api/governance/frameworks/:id - Delete framework config
GET    /api/governance/frameworks/:id/status - Get framework implementation status
```

### Policy APIs (Story 2.1)

```
POST   /api/governance/policies - Create policy
GET    /api/governance/policies - List policies
GET    /api/governance/policies/:id - Get policy detail
PUT    /api/governance/policies/:id - Update policy
DELETE /api/governance/policies/:id - Delete policy
POST   /api/governance/policies/:id/assign - Assign policy
GET    /api/governance/policies/:id/versions - Get policy versions
POST   /api/governance/policies/:id/submit-for-review - Submit for approval (Story 2.2)
```

### Control APIs (Story 3.1)

```
POST   /api/governance/controls - Create control
GET    /api/governance/controls - List controls
GET    /api/governance/controls/:id - Get control detail
PUT    /api/governance/controls/:id - Update control
DELETE /api/governance/controls/:id - Delete control
POST   /api/governance/controls/:id/assign - Assign control owner
POST   /api/governance/controls/:id/test-result - Record test result
GET    /api/governance/controls/:id/test-results - Get test history
```

---

## Implementation Notes

1. **Framework Configuration (7.1)** is the foundation
   - Must be created first
   - Links to existing ComplianceFramework for structure
   - Defines requirements for policies and controls
   - Can be used by multiple policies/controls

2. **Policy Creation (2.1)** depends on Framework Config
   - References framework to understand structure
   - Can link to related controls
   - Includes version control
   - Supports approval workflow

3. **Control Creation (3.1)** depends on Framework Config and Policy
   - References framework and policy
   - Includes testing and effectiveness tracking
   - Supports assignment to owners
   - Tracks test results and compliance

4. **All entities use soft deletes** for audit trail
5. **All entities include audit fields** (created_by, updated_by, timestamps)
6. **All entities support metadata** as JSONB for flexibility
7. **Version control** for policies enables change tracking
8. **Approval workflow** for policies (Story 2.2) uses PolicyApproval entity

---

## Testing Strategy

### Unit Tests
- Service layer: ~40 tests (20 per major service)
- DTO validation
- Business logic validation

### Integration Tests
- Repository operations
- Relationship handling
- Cascade deletes

### E2E Tests
- Full workflow: Create framework → Create policies → Create controls
- Approval workflow
- Version management
- Assignment and access control

---

## Next Steps

1. Implement entities in correct order:
   - GovernanceFrameworkConfig (Story 7.1)
   - Policy and related entities (Story 2.1)
   - UnifiedControl and related entities (Story 3.1)

2. Create database migrations

3. Implement services with CRUD operations

4. Implement API controllers

5. Implement approval workflow (Story 2.2)

6. Create unit and integration tests

7. Create frontend components

---

**Document Status**: Phase 1 Design Complete
**Last Updated**: December 23, 2025
**Author**: Architecture Team
