import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

async function addPhysicalValidationRules() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');
  const dbUser = process.env.POSTGRES_USER || 'postgres';
  const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
  const dbName = process.env.POSTGRES_DB || 'grc_platform';

  console.log(`Connecting to database: ${dbHost}:${dbPort}/${dbName}`);

  const dataSource = new DataSource({
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    // Simple SQL approach to add validation rules
    const queryRunner = dataSource.createQueryRunner();

    // Get admin user
    const adminUserResult = await queryRunner.query(`SELECT id FROM users WHERE email = 'admin@grcplatform.com'`);
    if (adminUserResult.length === 0) {
      console.log('Admin user not found. Please run the main seed script first.');
      await dataSource.destroy();
      process.exit(1);
    }
    const adminUserId = adminUserResult[0].id;

    // Get frameworks
    const frameworksResult = await queryRunner.query(`SELECT id FROM compliance_frameworks`);
    console.log(`Found ${frameworksResult.length} compliance frameworks`);

    // Get requirements
    const requirementsResult = await queryRunner.query(`SELECT * FROM compliance_requirements`);

    console.log('Adding physical validation rules for PII/PHI/Financial data...');

    // Define validation rules
    const validationRules = [
      {
        name: 'Data Classification for Physical Assets with PII',
        description: 'Physical assets containing PII must have appropriate classification',
        assetType: 'physical',
        priority: 10,
        validationLogic: {
          conditions: [
            { field: 'containsPII', operator: 'equals', value: true }
          ],
          complianceCriteria: [
            { field: 'dataClassification', operator: 'in', value: ['confidential', 'restricted', 'top_secret'] }
          ],
          nonComplianceCriteria: [
            { field: 'dataClassification', operator: 'in', value: ['public', 'internal'] }
          ]
        }
      },
      {
        name: 'Data Classification for Physical Assets with PHI',
        description: 'Physical assets containing PHI must have appropriate classification',
        assetType: 'physical',
        priority: 10,
        validationLogic: {
          conditions: [
            { field: 'containsPHI', operator: 'equals', value: true }
          ],
          complianceCriteria: [
            { field: 'dataClassification', operator: 'in', value: ['confidential', 'restricted', 'top_secret'] }
          ],
          nonComplianceCriteria: [
            { field: 'dataClassification', operator: 'in', value: ['public', 'internal'] }
          ]
        }
      },
      {
        name: 'Data Classification for Physical Assets with Financial Data',
        description: 'Physical assets containing financial data must have appropriate classification',
        assetType: 'physical',
        priority: 10,
        validationLogic: {
          conditions: [
            { field: 'containsFinancialData', operator: 'equals', value: true }
          ],
          complianceCriteria: [
            { field: 'dataClassification', operator: 'in', value: ['confidential', 'restricted', 'top_secret'] }
          ],
          nonComplianceCriteria: [
            { field: 'dataClassification', operator: 'in', value: ['public', 'internal'] }
          ]
        }
      },
      {
        name: 'Physical Security Requirements for Sensitive Data',
        description: 'Physical assets with sensitive data must meet security requirements',
        assetType: 'physical',
        priority: 9,
        validationLogic: {
          conditions: [
            { field: 'containsPII', operator: 'equals', value: true }
          ],
          complianceCriteria: [
            { field: 'criticalityLevel', operator: 'in', value: ['critical', 'high'] }
          ],
          nonComplianceCriteria: [
            { field: 'criticalityLevel', operator: 'in', value: ['low', 'medium'] }
          ]
        }
      }
    ];

    let createdRules = 0;
    let skippedRules = 0;

    // For each requirement, create validation rules
    for (const requirement of requirementsResult) {
      for (const ruleDef of validationRules) {
        // Check if rule already exists
        const existingRuleResult = await queryRunner.query(
          `SELECT COUNT(*) as count FROM compliance_validation_rules WHERE requirement_id = '${requirement.id}' AND asset_type = 'physical' AND rule_name = '${ruleDef.name}'`
        );

        if (existingRuleResult[0].count > 0) {
          console.log(`  ⏭️  Skipping existing rule: ${ruleDef.name} for requirement ${requirement.requirementCode || 'N/A'}`);
          skippedRules++;
          continue;
        }

        // Create new rule
        await queryRunner.query(`
          INSERT INTO compliance_validation_rules
          (requirement_id, asset_type, rule_name, rule_description, validation_logic, priority, is_active, created_by, createdAt, updatedAt)
          VALUES
          ('${requirement.id}', 'physical', '${ruleDef.name}', '${ruleDef.description}',
          '{"conditions": [{"field":"containsPII","operator":"equals","value":true}],"complianceCriteria":[{"field":"dataClassification","operator":"in","value":["confidential","restricted","top_secret"]}],"nonComplianceCriteria":[{"field":"dataClassification","operator":"in","value":["public","internal"]}]}',
          ${ruleDef.priority}, true, '${adminUserId}', NOW(), NOW())
        `);

        console.log(`  ✓ Created rule: ${ruleDef.name} for requirement ${requirement.requirementCode || 'N/A'}`);
        createdRules++;
      }
    }

    console.log(`\n✅ Physical validation rules creation complete!`);
    console.log(`   Created: ${createdRules} rules`);
    console.log(`   Skipped: ${skippedRules} existing rules`);

    await queryRunner.release();
    await dataSource.destroy();
  } catch (error) {
    console.error('Error adding physical validation rules:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  addPhysicalValidationRules()
    .then(() => {
      console.log('Physical validation rules creation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Physical validation rules creation failed:', error);
      process.exit(1);
    });
}

export { addPhysicalValidationRules };