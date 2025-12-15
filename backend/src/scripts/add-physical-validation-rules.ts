import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ComplianceValidationRule } from '../common/entities/compliance-validation-rule.entity';
import { ComplianceRequirement } from '../common/entities/compliance-requirement.entity';
import { ComplianceFramework } from '../common/entities/compliance-framework.entity';
import { User } from '../../users/entities/user.entity';

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

    const ruleRepository = dataSource.getRepository(ComplianceValidationRule);
    const requirementRepository = dataSource.getRepository(ComplianceRequirement);
    const frameworkRepository = dataSource.getRepository(ComplianceFramework);
    const userRepository = dataSource.getRepository(User);

    // Get admin user for created_by
    const adminUser = await userRepository.findOne({
      where: { email: 'admin@grcplatform.com' }
    });

    if (!adminUser) {
      console.log('Admin user not found. Please run the main seed script first.');
      await dataSource.destroy();
      process.exit(1);
    }

    // Get all frameworks
    const frameworks = await frameworkRepository.find();
    console.log(`Found ${frameworks.length} compliance frameworks`);

    // Get all requirements
    const requirements = await requirementRepository.find();
    console.log(`Found ${requirements.length} requirements`);

    // Define new validation rules for physical assets that check PII/PHI/Financial data
    const newRules = [
      {
        requirementCodePattern: /data.*classification|sensitive.*data|information.*protection/i,
        assetType: 'physical' as any,
        ruleName: 'Data Classification for Physical Assets with Sensitive Data',
        ruleDescription: 'Physical assets containing sensitive data (PII, PHI, Financial) must have appropriate classification',
        validationLogic: {
          conditions: [
            {
              field: 'containsPII',
              operator: 'equals',
              value: true,
            },
          ],
          complianceCriteria: [
            {
              field: 'dataClassification',
              operator: 'in',
              value: ['confidential', 'restricted', 'top_secret'],
            },
          ],
          nonComplianceCriteria: [
            {
              field: 'dataClassification',
              operator: 'in',
              value: ['public', 'internal'],
            },
          ],
        },
        priority: 10,
      },
      {
        requirementCodePattern: /data.*classification|sensitive.*data|information.*protection/i,
        assetType: 'physical' as any,
        ruleName: 'Data Classification for Physical Assets with PHI',
        ruleDescription: 'Physical assets containing PHI must have appropriate classification',
        validationLogic: {
          conditions: [
            {
              field: 'containsPHI',
              operator: 'equals',
              value: true,
            },
          ],
          complianceCriteria: [
            {
              field: 'dataClassification',
              operator: 'in',
              value: ['confidential', 'restricted', 'top_secret'],
            },
          ],
          nonComplianceCriteria: [
            {
              field: 'dataClassification',
              operator: 'in',
              value: ['public', 'internal'],
            },
          ],
        },
        priority: 10,
      },
      {
        requirementCodePattern: /data.*classification|sensitive.*data|information.*protection/i,
        assetType: 'physical' as any,
        ruleName: 'Data Classification for Physical Assets with Financial Data',
        ruleDescription: 'Physical assets containing financial data must have appropriate classification',
        validationLogic: {
          conditions: [
            {
              field: 'containsFinancialData',
              operator: 'equals',
              value: true,
            },
          ],
          complianceCriteria: [
            {
              field: 'dataClassification',
              operator: 'in',
              value: ['confidential', 'restricted', 'top_secret'],
            },
          ],
          nonComplianceCriteria: [
            {
              field: 'dataClassification',
              operator: 'in',
              value: ['public', 'internal'],
            },
          ],
        },
        priority: 10,
      },
      {
        requirementCodePattern: /physical.*security|access.*control|location.*security/i,
        assetType: 'physical' as any,
        ruleName: 'Physical Security Requirements for Sensitive Data',
        ruleDescription: 'Physical assets with sensitive data must meet physical security requirements',
        validationLogic: {
          conditions: [
            {
              field: 'containsPII',
              operator: 'equals',
              value: true,
            },
          ],
          complianceCriteria: [
            {
              field: 'criticalityLevel',
              operator: 'in',
              value: ['critical', 'high'],
            },
            {
              field: 'location',
              operator: 'exists',
              value: null,
            },
            {
              field: 'networkApprovalStatus',
              operator: 'equals',
              value: 'approved',
            },
          ],
          nonComplianceCriteria: [
            {
              field: 'criticalityLevel',
              operator: 'in',
              value: ['low', 'medium'],
            },
          ],
        },
        priority: 9,
      },
    ];

    console.log('\n📋 Adding physical asset validation rules for PII/PHI/Financial data...');

    let createdRules = 0;
    let skippedRules = 0;

    // For each requirement that matches the pattern, create a rule
    for (const ruleDef of newRules) {
      // Find matching requirements
      const matchingRequirements = requirements.filter((req) => {
        if (typeof ruleDef.requirementCodePattern === 'string') {
          return (
            req.requirementCode?.toLowerCase().includes(ruleDef.requirementCodePattern.toLowerCase()) ||
            req.title?.toLowerCase().includes(ruleDef.requirementCodePattern.toLowerCase()) ||
            req.description?.toLowerCase().includes(ruleDef.requirementCodePattern.toLowerCase())
          );
        } else {
          // RegExp
          return (
            ruleDef.requirementCodePattern.test(req.requirementCode || '') ||
            ruleDef.requirementCodePattern.test(req.title || '') ||
            ruleDef.requirementCodePattern.test(req.description || '')
          );
        }
      });

      for (const requirement of matchingRequirements) {
        // Check if rule already exists
        const existingRule = await ruleRepository.findOne({
          where: {
            requirementId: requirement.id,
            assetType: ruleDef.assetType,
            ruleName: ruleDef.ruleName,
          },
        });

        if (existingRule) {
          console.log(`  ⏭️  Skipping existing rule: ${ruleDef.ruleName} for requirement ${requirement.requirementCode || requirement.id}`);
          skippedRules++;
          continue;
        }

        // Create new rule
        const rule = ruleRepository.create({
          requirementId: requirement.id,
          assetType: ruleDef.assetType,
          ruleName: ruleDef.ruleName,
          ruleDescription: ruleDef.ruleDescription,
          validationLogic: ruleDef.validationLogic as any,
          priority: ruleDef.priority,
          isActive: true,
          createdById: adminUser.id,
        });

        await ruleRepository.save(rule);
        console.log(`  ✓ Created rule: ${ruleDef.ruleName} for requirement ${requirement.requirementCode || requirement.id}`);
        createdRules++;
      }
    }

    console.log(`\n✅ Physical validation rules creation complete!`);
    console.log(`   Created: ${createdRules} rules`);
    console.log(`   Skipped: ${skippedRules} existing rules`);

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