import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ComplianceFramework } from '../common/entities/compliance-framework.entity';
import { ComplianceRequirement } from '../common/entities/compliance-requirement.entity';
import { ComplianceValidationRule } from '../common/entities/compliance-validation-rule.entity';

interface ValidationLogic {
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'exists' | 'not_exists';
    value: any;
  }>;
  complianceCriteria: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  nonComplianceCriteria?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  partialComplianceCriteria?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
}
import { User } from '../users/entities/user.entity';

config();

interface RuleDefinition {
  requirementCodePattern: string | RegExp;
  assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier';
  ruleName: string;
  ruleDescription: string;
  validationLogic: ValidationLogic;
  priority: number;
}

async function seedValidationRules() {
  const dbHost = process.env.DB_HOST || 'postgres';
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

    const frameworkRepository = dataSource.getRepository(ComplianceFramework);
    const requirementRepository = dataSource.getRepository(ComplianceRequirement);
    const ruleRepository = dataSource.getRepository(ComplianceValidationRule);
    const userRepository = dataSource.getRepository(User);

    // Get admin user for created_by
    const adminUser = await userRepository.findOne({
      where: { email: 'admin@grcplatform.com' },
    });

    if (!adminUser) {
      console.error('Admin user not found. Please run the main seed script first.');
      process.exit(1);
    }

    // Get all frameworks
    const frameworks = await frameworkRepository.find();
    if (frameworks.length === 0) {
      console.error('No frameworks found. Please run the main seed script first.');
      process.exit(1);
    }

    // Define common validation rules
    const ruleDefinitions: RuleDefinition[] = [
      // Information Asset Rules
      {
        requirementCodePattern: /encrypt|encryption|data.*protect|sensitive.*data/i,
        assetType: 'information',
        ruleName: 'Data Classification for Sensitive Data',
        ruleDescription: 'Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification',
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
        requirementCodePattern: /classification|classify|data.*class/i,
        assetType: 'information',
        ruleName: 'Data Classification Required',
        ruleDescription: 'Information assets must have a data classification assigned',
        validationLogic: {
          conditions: [],
          complianceCriteria: [
            {
              field: 'dataClassification',
              operator: 'exists',
              value: null,
            },
          ],
          nonComplianceCriteria: [
            {
              field: 'dataClassification',
              operator: 'not_exists',
              value: null,
            },
          ],
        },
        priority: 5,
      },
      {
        requirementCodePattern: /retention|retain|data.*retention/i,
        assetType: 'information',
        ruleName: 'Retention Policy Required',
        ruleDescription: 'Information assets must have a retention policy defined',
        validationLogic: {
          conditions: [],
          complianceCriteria: [
            {
              field: 'retentionPolicy',
              operator: 'exists',
              value: null,
            },
          ],
          partialComplianceCriteria: [
            {
              field: 'retentionPolicy',
              operator: 'not_exists',
              value: null,
            },
          ],
        },
        priority: 7,
      },

      // Physical Asset Rules
      {
        requirementCodePattern: /network.*approval|network.*access|connectivity/i,
        assetType: 'physical',
        ruleName: 'Network Approval Required',
        ruleDescription: 'Physical assets connected to network must have network approval',
        validationLogic: {
          conditions: [
            {
              field: 'connectivityStatus',
              operator: 'equals',
              value: 'connected',
            },
          ],
          complianceCriteria: [
            {
              field: 'networkApprovalStatus',
              operator: 'equals',
              value: 'approved',
            },
          ],
          nonComplianceCriteria: [
            {
              field: 'networkApprovalStatus',
              operator: 'in',
              value: ['pending', 'rejected'],
            },
          ],
        },
        priority: 10,
      },
      {
        requirementCodePattern: /physical.*security|access.*control|location/i,
        assetType: 'physical',
        ruleName: 'Physical Location Required',
        ruleDescription: 'Physical assets must have location information recorded',
        validationLogic: {
          conditions: [],
          complianceCriteria: [
            {
              field: 'location',
              operator: 'exists',
              value: null,
            },
          ],
          partialComplianceCriteria: [
            {
              field: 'location',
              operator: 'not_exists',
              value: null,
            },
          ],
        },
        priority: 5,
      },
      {
        requirementCodePattern: /critical|criticality|risk.*level/i,
        assetType: 'physical',
        ruleName: 'Criticality Level Required',
        ruleDescription: 'Physical assets must have a criticality level assigned',
        validationLogic: {
          conditions: [],
          complianceCriteria: [
            {
              field: 'criticalityLevel',
              operator: 'exists',
              value: null,
            },
          ],
          nonComplianceCriteria: [
            {
              field: 'criticalityLevel',
              operator: 'not_exists',
              value: null,
            },
          ],
        },
        priority: 8,
      },

      // Application Rules
      {
        requirementCodePattern: /encrypt|encryption|data.*protect|sensitive.*data/i,
        assetType: 'application',
        ruleName: 'Criticality Level for Sensitive Data Processing',
        ruleDescription: 'Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level',
        validationLogic: {
          conditions: [
            {
              field: 'processesPII',
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
          ],
          partialComplianceCriteria: [
            {
              field: 'criticalityLevel',
              operator: 'equals',
              value: 'medium',
            },
          ],
        },
        priority: 10,
      },
      {
        requirementCodePattern: /access.*control|authentication|mfa|multi.*factor|security/i,
        assetType: 'application',
        ruleName: 'Criticality Level Required',
        ruleDescription: 'Applications must have a criticality level assigned for security assessment',
        validationLogic: {
          conditions: [],
          complianceCriteria: [
            {
              field: 'criticalityLevel',
              operator: 'exists',
              value: null,
            },
          ],
          partialComplianceCriteria: [
            {
              field: 'criticalityLevel',
              operator: 'not_exists',
              value: null,
            },
          ],
        },
        priority: 9,
      },
      {
        requirementCodePattern: /vendor|supplier|third.*party/i,
        assetType: 'application',
        ruleName: 'Vendor Information Required',
        ruleDescription: 'Applications must have vendor information recorded',
        validationLogic: {
          conditions: [],
          complianceCriteria: [
            {
              field: 'vendor',
              operator: 'exists',
              value: null,
            },
          ],
          partialComplianceCriteria: [
            {
              field: 'vendor',
              operator: 'not_exists',
              value: null,
            },
          ],
        },
        priority: 5,
      },

      // Supplier Rules
      {
        requirementCodePattern: /security.*assessment|due.*diligence|third.*party.*risk/i,
        assetType: 'supplier',
        ruleName: 'Security Assessment Required',
        ruleDescription: 'Suppliers with data access must have security assessment completed',
        validationLogic: {
          conditions: [
            {
              field: 'hasDataAccess',
              operator: 'equals',
              value: true,
            },
          ],
          complianceCriteria: [
            {
              field: 'hasSecurityAssessment',
              operator: 'equals',
              value: true,
            },
          ],
          nonComplianceCriteria: [
            {
              field: 'hasSecurityAssessment',
              operator: 'equals',
              value: false,
            },
          ],
        },
        priority: 10,
      },
      {
        requirementCodePattern: /nda|non.*disclosure|confidentiality/i,
        assetType: 'supplier',
        ruleName: 'NDA Required for Data Access',
        ruleDescription: 'Suppliers with data access must have NDA in place',
        validationLogic: {
          conditions: [
            {
              field: 'hasDataAccess',
              operator: 'equals',
              value: true,
            },
          ],
          complianceCriteria: [
            {
              field: 'requiresNDA',
              operator: 'equals',
              value: true,
            },
          ],
          nonComplianceCriteria: [
            {
              field: 'requiresNDA',
              operator: 'equals',
              value: false,
            },
          ],
        },
        priority: 9,
      },
      {
        requirementCodePattern: /critical|criticality|risk.*level/i,
        assetType: 'supplier',
        ruleName: 'Criticality Level Required',
        ruleDescription: 'Suppliers must have a criticality level assigned',
        validationLogic: {
          conditions: [],
          complianceCriteria: [
            {
              field: 'criticalityLevel',
              operator: 'exists',
              value: null,
            },
          ],
          partialComplianceCriteria: [
            {
              field: 'criticalityLevel',
              operator: 'not_exists',
              value: null,
            },
          ],
        },
        priority: 6,
      },

      // Software Asset Rules
      {
        requirementCodePattern: /vendor|supplier|third.*party|license/i,
        assetType: 'software',
        ruleName: 'Vendor Information Required',
        ruleDescription: 'Software assets must have vendor information recorded',
        validationLogic: {
          conditions: [],
          complianceCriteria: [
            {
              field: 'vendor',
              operator: 'exists',
              value: null,
            },
          ],
          partialComplianceCriteria: [
            {
              field: 'vendor',
              operator: 'not_exists',
              value: null,
            },
          ],
        },
        priority: 5,
      },
      {
        requirementCodePattern: /version|patch|update|vulnerability/i,
        assetType: 'software',
        ruleName: 'Version Information Required',
        ruleDescription: 'Software assets must have version information recorded',
        validationLogic: {
          conditions: [],
          complianceCriteria: [
            {
              field: 'version',
              operator: 'exists',
              value: null,
            },
          ],
          partialComplianceCriteria: [
            {
              field: 'version',
              operator: 'not_exists',
              value: null,
            },
          ],
        },
        priority: 7,
      },
    ];

    // Add physical asset specific rules for PII/PHI/Financial data
    const physicalAssetRules = [
      {
        requirementCodePattern: /data.*classification|sensitive.*data|information.*protection/i,
        assetType: 'physical',
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
        assetType: 'physical',
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
        assetType: 'physical',
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
        assetType: 'physical',
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

    // Merge the rules
    ruleDefinitions.push(...physicalAssetRules);

    console.log('\n📋 Seeding validation rules...');

    let totalRulesCreated = 0;
    let totalRulesSkipped = 0;

    // For each framework, find matching requirements and create rules
    for (const framework of frameworks) {
      console.log(`\nProcessing framework: ${framework.name} (${framework.code})`);

      const requirements = await requirementRepository.find({
        where: { frameworkId: framework.id },
      });

      console.log(`Found ${requirements.length} requirements for ${framework.name}`);

      for (const requirement of requirements) {
        // Find matching rule definitions
        const matchingRules = ruleDefinitions.filter((ruleDef) => {
          if (typeof ruleDef.requirementCodePattern === 'string') {
            return (
              requirement.requirementCode?.toLowerCase().includes(ruleDef.requirementCodePattern.toLowerCase()) ||
              requirement.title?.toLowerCase().includes(ruleDef.requirementCodePattern.toLowerCase()) ||
              requirement.description?.toLowerCase().includes(ruleDef.requirementCodePattern.toLowerCase())
            );
          } else {
            // RegExp
            return (
              ruleDef.requirementCodePattern.test(requirement.requirementCode || '') ||
              ruleDef.requirementCodePattern.test(requirement.title || '') ||
              ruleDef.requirementCodePattern.test(requirement.description || '')
            );
          }
        });

        for (const ruleDef of matchingRules) {
          // Check if rule already exists
          const existingRule = await ruleRepository.findOne({
            where: {
              requirementId: requirement.id,
              assetType: ruleDef.assetType,
              ruleName: ruleDef.ruleName,
            },
          });

          if (existingRule) {
            console.log(`  ⏭️  Skipping existing rule: ${ruleDef.ruleName} for ${ruleDef.assetType}`);
            totalRulesSkipped++;
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
          console.log(
            `  ✓ Created rule: ${ruleDef.ruleName} for ${ruleDef.assetType} (Requirement: ${requirement.requirementCode || requirement.title})`,
          );
          totalRulesCreated++;
        }
      }
    }

    console.log(`\n✅ Validation rules seeding complete!`);
    console.log(`   Created: ${totalRulesCreated} rules`);
    console.log(`   Skipped: ${totalRulesSkipped} existing rules`);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding validation rules:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedValidationRules()
    .then(() => {
      console.log('Seed script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

export { seedValidationRules };

