# Governance Module - Database Migration Scripts

**Migration Strategy**: TypeORM migrations following existing backend patterns  
**Database**: PostgreSQL 14+  
**Naming Convention**: `[Timestamp]-[Description].ts`

---

## Migration Files Overview

### Phase 1 Migrations

1. **1701000000001-CreateGovernanceEnums.ts** - Create all enum types
2. **1701000000002-CreateInfluencersTable.ts** - Create influencers and compliance_obligations tables
3. **1701000000003-CreatePoliciesTable.ts** - Create policies, control_objectives, and policy_acknowledgments tables
4. **1701000000004-CreateStandardsBaselinesTable.ts** - Create standards, baselines, and baseline_asset_assignments tables
5. **1701000000005-CreateFrameworksTable.ts** - Create compliance_frameworks and framework_requirements tables
6. **1701000000006-CreateControlsTable.ts** - Create unified_controls and related mapping tables
7. **1701000000007-CreateAssessmentsTable.ts** - Create assessments, assessment_results, and findings tables
8. **1701000000008-CreateEvidenceTable.ts** - Create evidence and evidence_linkages tables
9. **1701000000009-CreateSOPsTable.ts** - Create sops, sop_executions, and sop_training tables
10. **1701000000010-CreateExceptionsTable.ts** - Create policy_exceptions table
11. **1701000000011-CreateTestingTable.ts** - Create control_tests, test_executions, and KCI tables
12. **1701000000012-CreateGovernanceViews.ts** - Create database views
13. **1701000000013-CreateGovernanceFunctions.ts** - Create database functions
14. **1701000000014-CreateGovernanceTriggers.ts** - Create triggers for audit and updates
15. **1701000000015-SeedInitialFrameworks.ts** - Seed initial compliance frameworks

---

## Migration 1: Create Governance Enums

**File**: `backend/src/migrations/1701000000001-CreateGovernanceEnums.ts`

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGovernanceEnums1701000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Influencer enums
    await queryRunner.query(`
      CREATE TYPE influencer_category_enum AS ENUM (
        'internal',
        'contractual',
        'statutory',
        'regulatory',
        'industry_standard'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE influencer_status_enum AS ENUM (
        'active',
        'pending',
        'superseded',
        'retired'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE applicability_status_enum AS ENUM (
        'applicable',
        'not_applicable',
        'under_review'
      );
    `);

    // Policy enums
    await queryRunner.query(`
      CREATE TYPE policy_status_enum AS ENUM (
        'draft',
        'in_review',
        'approved',
        'published',
        'archived'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE review_frequency_enum AS ENUM (
        'annual',
        'biennial',
        'triennial',
        'quarterly',
        'monthly',
        'as_needed'
      );
    `);

    // Control enums
    await queryRunner.query(`
      CREATE TYPE control_type_enum AS ENUM (
        'preventive',
        'detective',
        'corrective',
        'compensating',
        'administrative',
        'technical',
        'physical'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE control_complexity_enum AS ENUM (
        'high',
        'medium',
        'low'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE control_cost_impact_enum AS ENUM (
        'high',
        'medium',
        'low'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE control_status_enum AS ENUM (
        'draft',
        'active',
        'deprecated'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE implementation_status_enum AS ENUM (
        'not_implemented',
        'planned',
        'in_progress',
        'implemented',
        'not_applicable'
      );
    `);

    // Framework enums
    await queryRunner.query(`
      CREATE TYPE framework_status_enum AS ENUM (
        'active',
        'draft',
        'deprecated'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE mapping_coverage_enum AS ENUM (
        'full',
        'partial',
        'not_applicable'
      );
    `);

    // Assessment enums
    await queryRunner.query(`
      CREATE TYPE assessment_type_enum AS ENUM (
        'implementation',
        'design_effectiveness',
        'operating_effectiveness',
        'compliance'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE assessment_status_enum AS ENUM (
        'not_started',
        'in_progress',
        'under_review',
        'completed',
        'cancelled'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE assessment_result_enum AS ENUM (
        'compliant',
        'non_compliant',
        'partially_compliant',
        'not_applicable',
        'not_tested'
      );
    `);

    // Finding enums
    await queryRunner.query(`
      CREATE TYPE finding_severity_enum AS ENUM (
        'critical',
        'high',
        'medium',
        'low',
        'informational'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE finding_status_enum AS ENUM (
        'open',
        'in_progress',
        'closed',
        'risk_accepted',
        'false_positive'
      );
    `);

    // Evidence enums
    await queryRunner.query(`
      CREATE TYPE evidence_type_enum AS ENUM (
        'policy_document',
        'configuration_screenshot',
        'system_log',
        'scan_report',
        'test_result',
        'certification',
        'training_record',
        'meeting_minutes',
        'email_correspondence',
        'contract',
        'other'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE evidence_status_enum AS ENUM (
        'draft',
        'under_review',
        'approved',
        'expired',
        'rejected'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE evidence_link_type_enum AS ENUM (
        'control',
        'assessment',
        'finding',
        'asset',
        'policy',
        'standard'
      );
    `);

    // SOP enums
    await queryRunner.query(`
      CREATE TYPE sop_category_enum AS ENUM (
        'operational',
        'security',
        'compliance',
        'third_party',
        'incident_response',
        'business_continuity',
        'other'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE sop_status_enum AS ENUM (
        'draft',
        'in_review',
        'approved',
        'published',
        'archived'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE execution_outcome_enum AS ENUM (
        'successful',
        'failed',
        'partially_completed',
        'cancelled'
      );
    `);

    // Exception enums
    await queryRunner.query(`
      CREATE TYPE exception_status_enum AS ENUM (
        'requested',
        'under_review',
        'approved',
        'rejected',
        'expired',
        'revoked'
      );
    `);

    // Testing enums
    await queryRunner.query(`
      CREATE TYPE test_frequency_enum AS ENUM (
        'weekly',
        'monthly',
        'quarterly',
        'semi_annually',
        'annually',
        'ad_hoc'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE test_result_enum AS ENUM (
        'pass',
        'fail',
        'not_tested',
        'inconclusive'
      );
    `);

    // KCI enums
    await queryRunner.query(`
      CREATE TYPE kci_data_type_enum AS ENUM (
        'percentage',
        'count',
        'rating',
        'yes_no',
        'custom'
      );
    `);

    // Baseline enums
    await queryRunner.query(`
      CREATE TYPE baseline_compliance_status_enum AS ENUM (
        'compliant',
        'non_compliant',
        'partially_compliant',
        'not_assessed',
        'exception_approved'
      );
    `);

    // Obligation enums
    await queryRunner.query(`
      CREATE TYPE obligation_status_enum AS ENUM (
        'met',
        'not_met',
        'in_progress',
        'not_applicable'
      );
    `);

    // Control relationship enums
    await queryRunner.query(`
      CREATE TYPE control_relationship_type_enum AS ENUM (
        'depends_on',
        'compensates_for',
        'supports',
        'related_to'
      );
    `);

    // Standard enums
    await queryRunner.query(`
      CREATE TYPE standard_status_enum AS ENUM (
        'draft',
        'in_review',
        'approved',
        'published',
        'archived'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop enums in reverse order
    await queryRunner.query(`DROP TYPE IF EXISTS standard_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_relationship_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS obligation_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS baseline_compliance_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS kci_data_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS test_result_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS test_frequency_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS exception_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS execution_outcome_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS sop_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS sop_category_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS evidence_link_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS evidence_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS evidence_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS finding_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS finding_severity_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS assessment_result_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS assessment_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS assessment_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS mapping_coverage_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS framework_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS implementation_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_cost_impact_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_complexity_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS review_frequency_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS policy_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS applicability_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS influencer_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS influencer_category_enum;`);
  }
}
```

---

## Migration 2: Create Influencers Table

**File**: `backend/src/migrations/1701000000002-CreateInfluencersTable.ts`

```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateInfluencersTable1701000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create influencers table
    await queryRunner.createTable(
      new Table({
        name: 'influencers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'influencer_category_enum',
            isNullable: false,
          },
          {
            name: 'sub_category',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'issuing_authority',
            type: 'varchar',
            length: '300',
            isNullable: true,
          },
          {
            name: 'jurisdiction',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'reference_number',
            type: 'varchar',
            length: '200',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'publication_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'effective_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'last_revision_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'next_review_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'influencer_status_enum',
            default: "'active'",
          },
          {
            name: 'applicability_status',
            type: 'applicability_status_enum',
            default: "'under_review'",
          },
          {
            name: 'applicability_justification',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'applicability_assessment_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'applicability_criteria',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'source_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'source_document_path',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'owner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'business_units_affected',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'varchar[]',
            isNullable: true,
          },
          {
            name: 'custom_fields',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'influencers',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'influencers',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'influencers',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.createIndex('influencers', new TableIndex({ columnNames: ['category'] }));
    await queryRunner.createIndex('influencers', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('influencers', new TableIndex({ columnNames: ['applicability_status'] }));
    await queryRunner.createIndex('influencers', new TableIndex({ columnNames: ['owner_id'] }));
    await queryRunner.createIndex('influencers', new TableIndex({ columnNames: ['reference_number'] }));
    await queryRunner.createIndex(
      'influencers',
      new TableIndex({
        columnNames: ['next_review_date'],
        where: 'next_review_date IS NOT NULL AND deleted_at IS NULL',
      }),
    );

    // Create GIN index for tags
    await queryRunner.query(`
      CREATE INDEX idx_influencers_tags ON influencers USING gin(tags);
    `);

    // Create full-text search index
    await queryRunner.query(`
      CREATE INDEX idx_influencers_search ON influencers USING gin(
        to_tsvector('english', 
          coalesce(name, '') || ' ' || 
          coalesce(issuing_authority, '') || ' ' ||
          coalesce(description, '')
        )
      );
    `);

    // Create compliance_obligations table
    await queryRunner.createTable(
      new Table({
        name: 'compliance_obligations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'influencer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'obligation_text',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'obligation_category',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'responsible_party_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'obligation_status_enum',
            default: "'not_met'",
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'completion_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'compliance_obligations',
      new TableForeignKey({
        columnNames: ['influencer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'influencers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex('compliance_obligations', new TableIndex({ columnNames: ['influencer_id'] }));
    await queryRunner.createIndex('compliance_obligations', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('compliance_obligations', new TableIndex({ columnNames: ['responsible_party_id'] }));
    await queryRunner.createIndex('compliance_obligations', new TableIndex({ columnNames: ['priority'] }));

    // Add check constraint for dates
    await queryRunner.query(`
      ALTER TABLE influencers
      ADD CONSTRAINT valid_dates CHECK (
        (effective_date IS NULL OR publication_date IS NULL OR effective_date >= publication_date) AND
        (last_revision_date IS NULL OR publication_date IS NULL OR last_revision_date >= publication_date)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('compliance_obligations', true);
    await queryRunner.dropTable('influencers', true);
  }
}
```

---

## Migration 3: Create Policies Table

**File**: `backend/src/migrations/1701000000003-CreatePoliciesTable.ts`

```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreatePoliciesTable1701000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create policies table
    await queryRunner.createTable(
      new Table({
        name: 'policies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'policy_type',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'version',
            type: 'varchar',
            length: '50',
            default: "'1.0'",
          },
          {
            name: 'version_number',
            type: 'integer',
            default: 1,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'purpose',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'scope',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'owner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'business_units',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'policy_status_enum',
            default: "'draft'",
          },
          {
            name: 'approval_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'effective_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'review_frequency',
            type: 'review_frequency_enum',
            default: "'annual'",
          },
          {
            name: 'next_review_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'published_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'linked_influencers',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'supersedes_policy_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'attachments',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'varchar[]',
            isNullable: true,
          },
          {
            name: 'custom_fields',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'requires_acknowledgment',
            type: 'boolean',
            default: true,
          },
          {
            name: 'acknowledgment_due_days',
            type: 'integer',
            default: 30,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'policies',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'policies',
      new TableForeignKey({
        columnNames: ['supersedes_policy_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'policies',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.createIndex('policies', new TableIndex({ columnNames: ['policy_type'] }));
    await queryRunner.createIndex('policies', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('policies', new TableIndex({ columnNames: ['owner_id'] }));
    await queryRunner.createIndex(
      'policies',
      new TableIndex({
        columnNames: ['next_review_date'],
        where: 'next_review_date IS NOT NULL AND deleted_at IS NULL',
      }),
    );
    await queryRunner.createIndex('policies', new TableIndex({ columnNames: ['title', 'version_number'] }));

    // Create full-text search index
    await queryRunner.query(`
      CREATE INDEX idx_policies_search ON policies USING gin(
        to_tsvector('english', 
          coalesce(title, '') || ' ' || 
          coalesce(content, '')
        )
      );
    `);

    // Create GIN index for linked_influencers
    await queryRunner.query(`
      CREATE INDEX idx_policies_linked_influencers ON policies USING gin(linked_influencers);
    `);

    // Create policy_acknowledgments table
    await queryRunner.createTable(
      new Table({
        name: 'policy_acknowledgments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'policy_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'policy_version',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'acknowledged_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'inet',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'assigned_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'reminder_sent_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'last_reminder_sent',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'policy_acknowledgments',
      new TableForeignKey({
        columnNames: ['policy_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'policies',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'policy_acknowledgments',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex('policy_acknowledgments', new TableIndex({ columnNames: ['policy_id'] }));
    await queryRunner.createIndex('policy_acknowledgments', new TableIndex({ columnNames: ['user_id'] }));
    await queryRunner.createIndex(
      'policy_acknowledgments',
      new TableIndex({
        columnNames: ['policy_id', 'user_id'],
        where: 'acknowledged_at IS NULL',
      }),
    );

    // Create unique constraint
    await queryRunner.query(`
      ALTER TABLE policy_acknowledgments
      ADD CONSTRAINT unique_policy_user_version UNIQUE (policy_id, user_id, policy_version);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('policy_acknowledgments', true);
    await queryRunner.dropTable('policies', true);
  }
}
```

---

## Migration 4: Create Control Objectives Table

**File**: `backend/src/migrations/1701000000003-CreateControlObjectivesTable.ts`

```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateControlObjectivesTable1701000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'control_objectives',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'objective_identifier',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'policy_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'statement',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'rationale',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'domain',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'mandatory',
            type: 'boolean',
            default: true,
          },
          {
            name: 'responsible_party_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'implementation_status',
            type: 'implementation_status_enum',
            default: "'not_implemented'",
          },
          {
            name: 'target_implementation_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'actual_implementation_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'linked_influencers',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'control_objectives',
      new TableForeignKey({
        columnNames: ['policy_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'policies',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['policy_id'] }));
    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['objective_identifier'] }));
    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['domain'] }));
    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['responsible_party_id'] }));
    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['implementation_status'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('control_objectives', true);
  }
}
```

---

## Migration Execution Instructions

### Running Migrations

```bash
# Generate migration (TypeORM CLI)
npm run typeorm migration:generate -- -n CreateGovernanceEnums

# Run migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert

# Show migration status
npm run typeorm migration:show
```

### Migration Order

Migrations must be run in order:
1. Create enums first (1701000000001)
2. Create tables in dependency order
3. Create views and functions last
4. Seed data after all tables created

### Notes

- All migrations use soft deletes (`deleted_at`)
- Foreign keys reference shared `users` table
- Indexes optimized for common queries
- Full-text search indexes for search functionality
- GIN indexes for array and JSONB columns

---

## Additional Migrations

Due to length constraints, the remaining migrations follow the same pattern:

- **Migration 4**: Standards, Baselines, Guidelines
- **Migration 5**: Compliance Frameworks
- **Migration 6**: Unified Controls
- **Migration 7**: Assessments
- **Migration 8**: Evidence
- **Migration 9**: SOPs
- **Migration 10**: Exceptions
- **Migration 11**: Testing & KCIs
- **Migration 12**: Views
- **Migration 13**: Functions
- **Migration 14**: Triggers
- **Migration 15**: Seed Data

See the Governance PRD document (Section 9: Database Schema) for complete table definitions.

---

**Migration Version**: 1.0  
**Last Updated**: December 2024




