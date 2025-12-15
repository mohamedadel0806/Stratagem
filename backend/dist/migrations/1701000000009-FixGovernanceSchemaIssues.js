"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixGovernanceSchemaIssues1701000000009 = void 0;
class FixGovernanceSchemaIssues1701000000009 {
    async up(queryRunner) {
        const columnsToAdd = [
            { name: 'policy_type', type: 'VARCHAR(200)', nullable: true },
            { name: 'owner_id', type: 'UUID', nullable: true },
            { name: 'version_number', type: 'INTEGER', default: 1 },
            { name: 'content', type: 'TEXT', nullable: true },
            { name: 'purpose', type: 'TEXT', nullable: true },
            { name: 'scope', type: 'TEXT', nullable: true },
            { name: 'business_units', type: 'UUID[]', nullable: true },
            { name: 'approval_date', type: 'DATE', nullable: true },
            { name: 'review_frequency', type: 'review_frequency_enum', nullable: true },
            { name: 'next_review_date', type: 'DATE', nullable: true },
            { name: 'published_date', type: 'DATE', nullable: true },
            { name: 'linked_influencers', type: 'UUID[]', nullable: true },
            { name: 'supersedes_policy_id', type: 'UUID', nullable: true },
            { name: 'attachments', type: 'JSONB', nullable: true },
            { name: 'tags', type: 'VARCHAR[]', nullable: true },
            { name: 'custom_fields', type: 'JSONB', nullable: true },
            { name: 'requires_acknowledgment', type: 'BOOLEAN', default: true },
            { name: 'acknowledgment_due_days', type: 'INTEGER', default: 30 },
            { name: 'created_by', type: 'UUID', nullable: true },
            { name: 'updated_by', type: 'UUID', nullable: true },
            { name: 'deleted_at', type: 'TIMESTAMP', nullable: true },
        ];
        console.log('Adding Governance columns to policies table...');
        for (const col of columnsToAdd) {
            const columnExists = await queryRunner.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'policies' AND column_name = '${col.name}'
      `);
            if (columnExists.length === 0) {
                const defaultClause = col.default ? ` DEFAULT ${col.default}` : '';
                const nullableClause = col.nullable !== false ? ' NULL' : ' NOT NULL';
                await queryRunner.query(`
          ALTER TABLE policies 
          ADD COLUMN ${col.name} ${col.type}${defaultClause}${nullableClause}
        `);
            }
        }
        console.log('✓ Added Governance columns to policies table');
        const foreignKeys = [
            { column: 'owner_id', table: 'users', columnRef: 'id' },
            { column: 'supersedes_policy_id', table: 'policies', columnRef: 'id' },
            { column: 'created_by', table: 'users', columnRef: 'id' },
            { column: 'updated_by', table: 'users', columnRef: 'id' },
        ];
        for (const fk of foreignKeys) {
            const fkExists = await queryRunner.query(`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'policies' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name LIKE '%${fk.column}%'
      `);
            if (fkExists.length === 0) {
                await queryRunner.query(`
          ALTER TABLE policies 
          ADD CONSTRAINT fk_policies_${fk.column} 
          FOREIGN KEY (${fk.column}) 
          REFERENCES ${fk.table}(${fk.columnRef}) 
          ON DELETE SET NULL
        `);
            }
        }
        const enumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'assessment_type_enum'
      )
    `);
        if (enumExists[0].exists) {
            const currentValues = await queryRunner.query(`
        SELECT enumlabel 
        FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'assessment_type_enum')
        ORDER BY enumsortorder
      `);
            const currentValueStrings = currentValues.map((v) => v.enumlabel);
            const requiredValues = ['implementation', 'design_effectiveness', 'operating_effectiveness', 'compliance'];
            const needsUpdate = !requiredValues.every(val => currentValueStrings.includes(val));
            if (needsUpdate) {
                console.log('Updating assessment_type_enum with Governance values...');
                const tablesUsingEnum = await queryRunner.query(`
          SELECT table_name, column_name 
          FROM information_schema.columns 
          WHERE udt_name = 'assessment_type_enum'
        `);
                if (tablesUsingEnum.length > 0) {
                    for (const tableInfo of tablesUsingEnum) {
                        await queryRunner.query(`
              ALTER TABLE ${tableInfo.table_name} 
              ALTER COLUMN ${tableInfo.column_name} TYPE TEXT
            `);
                    }
                    await queryRunner.query(`DROP TYPE IF EXISTS assessment_type_enum CASCADE`);
                }
                await queryRunner.query(`
          CREATE TYPE assessment_type_enum AS ENUM (
            'implementation',
            'design_effectiveness',
            'operating_effectiveness',
            'compliance'
          )
        `);
                for (const tableInfo of tablesUsingEnum) {
                    await queryRunner.query(`
            ALTER TABLE ${tableInfo.table_name} 
            ALTER COLUMN ${tableInfo.column_name} TYPE assessment_type_enum 
            USING ${tableInfo.column_name}::text::assessment_type_enum
          `);
                }
                console.log('✓ Updated assessment_type_enum');
            }
            else {
                console.log('✓ assessment_type_enum already has correct values');
            }
        }
        else {
            console.log('Creating assessment_type_enum...');
            await queryRunner.query(`
        CREATE TYPE assessment_type_enum AS ENUM (
          'implementation',
          'design_effectiveness',
          'operating_effectiveness',
          'compliance'
        )
      `);
            console.log('✓ Created assessment_type_enum');
        }
    }
    async down(queryRunner) {
        console.log('Migration down: Schema fixes are not reversible');
    }
}
exports.FixGovernanceSchemaIssues1701000000009 = FixGovernanceSchemaIssues1701000000009;
//# sourceMappingURL=1701000000009-FixGovernanceSchemaIssues.js.map