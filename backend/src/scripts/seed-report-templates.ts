import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ReportTemplate, ReportType, ReportFormat } from '../asset/entities/report-template.entity';
import { User } from '../users/entities/user.entity';

config();

async function seedReportTemplates() {
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
    namingStrategy: new SnakeNamingStrategy(),
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const templateRepository = dataSource.getRepository(ReportTemplate);
    const userRepository = dataSource.getRepository(User);

    // Get first admin user or create a system user ID
    const adminUser = await userRepository.findOne({
      where: { email: 'admin@grcplatform.com' },
    });

    if (!adminUser) {
      console.log('Admin user not found. Please run main seed script first.');
      await dataSource.destroy();
      return;
    }

    // Check if system templates already exist
    const existingSystemTemplates = await templateRepository.count({
      where: { isSystemTemplate: true },
    });

    if (existingSystemTemplates > 0) {
      console.log(`Found ${existingSystemTemplates} existing system templates. Skipping seed.`);
      await dataSource.destroy();
      return;
    }

    console.log('Creating pre-built report templates...');

    const systemTemplates: Partial<ReportTemplate>[] = [
      {
        name: 'Executive Summary Report',
        description: 'High-level overview of asset inventory, compliance status, and key metrics for executive review',
        reportType: ReportType.ASSET_INVENTORY,
        format: ReportFormat.PDF,
        fieldSelection: [
          'uniqueIdentifier',
          'assetDescription',
          'criticalityLevel',
          'ownerId',
          'businessUnitId',
          'complianceRequirements',
        ],
        filters: {},
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Asset Inventory Report',
        description: 'Complete inventory of all physical assets with key details',
        reportType: ReportType.ASSET_INVENTORY,
        format: ReportFormat.EXCEL,
        fieldSelection: [
          'uniqueIdentifier',
          'assetDescription',
          'manufacturer',
          'model',
          'serialNumber',
          'assetTag',
          'criticalityLevel',
          'ownerId',
          'businessUnitId',
          'physicalLocation',
          'purchaseDate',
          'warrantyExpiry',
        ],
        filters: {},
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Compliance Status Report',
        description: 'Overview of compliance status across all assets and frameworks',
        reportType: ReportType.COMPLIANCE_REPORT,
        format: ReportFormat.EXCEL,
        fieldSelection: [],
        filters: {},
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Security Test Summary',
        description: 'Summary of security test results for all assets',
        reportType: ReportType.SECURITY_TEST_REPORT,
        format: ReportFormat.EXCEL,
        fieldSelection: [],
        filters: {},
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Assets Without Owners',
        description: 'List of all assets that do not have assigned owners',
        reportType: ReportType.ASSET_INVENTORY,
        format: ReportFormat.EXCEL,
        fieldSelection: [
          'uniqueIdentifier',
          'assetDescription',
          'assetTypeId',
          'criticalityLevel',
          'businessUnitId',
          'physicalLocation',
        ],
        filters: { ownerId: null },
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Assets Missing Information',
        description: 'Assets with missing critical information fields',
        reportType: ReportType.ASSET_INVENTORY,
        format: ReportFormat.EXCEL,
        fieldSelection: [
          'uniqueIdentifier',
          'assetDescription',
          'ownerId',
          'businessUnitId',
          'criticalityLevel',
        ],
        filters: {},
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Assets by Compliance Scope',
        description: 'Assets grouped by compliance framework and scope',
        reportType: ReportType.ASSET_INVENTORY,
        format: ReportFormat.EXCEL,
        fieldSelection: [
          'uniqueIdentifier',
          'assetDescription',
          'complianceRequirements',
          'criticalityLevel',
          'ownerId',
        ],
        filters: {},
        grouping: { groupBy: 'complianceScope' },
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Software Inventory Report',
        description: 'Complete inventory of all software assets',
        reportType: ReportType.SOFTWARE_INVENTORY,
        format: ReportFormat.EXCEL,
        fieldSelection: [],
        filters: {},
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Contract Expiration Report',
        description: 'Contracts and agreements expiring within the next 90 days',
        reportType: ReportType.CONTRACT_EXPIRATION,
        format: ReportFormat.EXCEL,
        fieldSelection: [],
        filters: { days: 90 },
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Supplier Criticality Report',
        description: 'Suppliers ranked by criticality and risk level',
        reportType: ReportType.SUPPLIER_CRITICALITY,
        format: ReportFormat.EXCEL,
        fieldSelection: [],
        filters: {},
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Risk Assessment Summary',
        description: 'Summary of risk assessments for all assets',
        reportType: ReportType.ASSET_INVENTORY,
        format: ReportFormat.PDF,
        fieldSelection: [
          'uniqueIdentifier',
          'assetDescription',
          'criticalityLevel',
          'complianceRequirements',
        ],
        filters: {},
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'Audit Trail Report',
        description: 'Complete audit trail of all asset changes and activities',
        reportType: ReportType.ASSET_INVENTORY,
        format: ReportFormat.CSV,
        fieldSelection: [],
        filters: {},
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
      {
        name: 'High Criticality Assets',
        description: 'All assets with high or critical criticality levels',
        reportType: ReportType.ASSET_INVENTORY,
        format: ReportFormat.EXCEL,
        fieldSelection: [
          'uniqueIdentifier',
          'assetDescription',
          'criticalityLevel',
          'ownerId',
          'businessUnitId',
          'complianceRequirements',
        ],
        filters: { criticalityLevel: ['high', 'critical'] },
        isScheduled: false,
        isActive: true,
        isSystemTemplate: true,
        createdById: adminUser.id,
      },
    ];

    for (const templateData of systemTemplates) {
      const template = templateRepository.create(templateData);
      await templateRepository.save(template);
      console.log(`✓ Created template: ${template.name}`);
    }

    console.log(`\n✅ Successfully created ${systemTemplates.length} pre-built report templates!`);
    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding report templates:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedReportTemplates()
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}

export { seedReportTemplates };
