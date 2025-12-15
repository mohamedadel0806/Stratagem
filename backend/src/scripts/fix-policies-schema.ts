import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

async function fixPoliciesSchema() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');
  const dbUser = process.env.POSTGRES_USER || 'postgres';
  const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
  const dbName = process.env.POSTGRES_DB || 'grc_platform';

  const dataSource = new DataSource({
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    synchronize: false,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    const columnsToAdd = [
      { name: 'policy_type', type: 'VARCHAR(200)', nullable: true },
      { name: 'owner_id', type: 'UUID', nullable: true },
      { name: 'version_number', type: 'INTEGER', default: '1' },
      { name: 'content', type: 'TEXT', nullable: true },
      { name: 'purpose', type: 'TEXT', nullable: true },
      { name: 'scope', type: 'TEXT', nullable: true },
      { name: 'business_units', type: 'UUID[]', nullable: true },
      { name: 'approval_date', type: 'DATE', nullable: true },
      { name: 'effective_date', type: 'DATE', nullable: true },
      { name: 'review_frequency', type: 'review_frequency_enum', nullable: true },
      { name: 'next_review_date', type: 'DATE', nullable: true },
      { name: 'published_date', type: 'DATE', nullable: true },
      { name: 'linked_influencers', type: 'UUID[]', nullable: true },
      { name: 'supersedes_policy_id', type: 'UUID', nullable: true },
      { name: 'attachments', type: 'JSONB', nullable: true },
      { name: 'tags', type: 'VARCHAR[]', nullable: true },
      { name: 'custom_fields', type: 'JSONB', nullable: true },
      { name: 'requires_acknowledgment', type: 'BOOLEAN', default: 'true' },
      { name: 'acknowledgment_due_days', type: 'INTEGER', default: '30' },
      { name: 'created_by', type: 'UUID', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: true, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_by', type: 'UUID', nullable: true },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: true, default: 'CURRENT_TIMESTAMP' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true },
    ];

    console.log('Adding Governance columns to policies table...\n');
    for (const col of columnsToAdd) {
      const columnExists = await dataSource.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'policies' AND column_name = '${col.name}'
      `);

      if (columnExists.length === 0) {
        const defaultClause = col.default ? ` DEFAULT ${col.default}` : '';
        const nullableClause = col.nullable !== false ? '' : ' NOT NULL';
        await dataSource.query(`
          ALTER TABLE policies 
          ADD COLUMN ${col.name} ${col.type}${defaultClause}${nullableClause}
        `);
        console.log(`✓ Added column: ${col.name}`);
      } else {
        console.log(`- Column already exists: ${col.name}`);
      }
    }

    // Add foreign keys
    console.log('\nAdding foreign keys...');
    const foreignKeys = [
      { column: 'owner_id', table: 'users', columnRef: 'id', name: 'fk_policies_owner_id' },
      { column: 'supersedes_policy_id', table: 'policies', columnRef: 'id', name: 'fk_policies_supersedes' },
      { column: 'created_by', table: 'users', columnRef: 'id', name: 'fk_policies_created_by' },
      { column: 'updated_by', table: 'users', columnRef: 'id', name: 'fk_policies_updated_by' },
    ];

    for (const fk of foreignKeys) {
      const fkExists = await dataSource.query(`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'policies' 
        AND constraint_name = '${fk.name}'
      `);

      if (fkExists.length === 0) {
        await dataSource.query(`
          ALTER TABLE policies 
          ADD CONSTRAINT ${fk.name} 
          FOREIGN KEY (${fk.column}) 
          REFERENCES ${fk.table}(${fk.columnRef}) 
          ON DELETE SET NULL
        `);
        console.log(`✓ Added foreign key: ${fk.name}`);
      } else {
        console.log(`- Foreign key already exists: ${fk.name}`);
      }
    }

    console.log('\n✅ Schema fixes completed!');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error fixing schema:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

fixPoliciesSchema();

