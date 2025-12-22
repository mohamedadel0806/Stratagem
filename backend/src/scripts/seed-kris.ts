import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User, UserRole } from '../users/entities/user.entity';
import { KRI, MeasurementFrequency, KRIStatus, KRITrend } from '../risk/entities/kri.entity';
import { RiskCategory } from '../risk/entities/risk-category.entity';

config();

async function seedKRIs() {
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
    console.log('Database connection established\n');

    const userRepository = dataSource.getRepository(User);
    const kriRepository = dataSource.getRepository(KRI);
    const categoryRepository = dataSource.getRepository(RiskCategory);

    // Get users
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('⚠️  No users found. Please run the main seed script first.');
      await dataSource.destroy();
      return;
    }

    const adminUser = users.find((u) => u.role === UserRole.SUPER_ADMIN) || users[0];
    const riskManager = users.find((u) => u.role === UserRole.RISK_MANAGER) || users[0];

    // Get categories
    const categories = await categoryRepository.find();
    const operationalCategory = categories.find((c) => c.name?.toLowerCase().includes('operational')) || categories[0];
    const financialCategory = categories.find((c) => c.name?.toLowerCase().includes('financial')) || categories[0];
    const strategicCategory = categories.find((c) => c.name?.toLowerCase().includes('strategic')) || categories[0];

    // Check if KRIs already exist
    const existingKRIs = await kriRepository.count();
    if (existingKRIs > 0) {
      console.log(`Found ${existingKRIs} existing KRIs. Skipping seed.`);
      await dataSource.destroy();
      return;
    }

    console.log('📋 Seeding KRIs...\n');

    const kriData = [
      {
        kri_id: 'KRI-001',
        name: 'Failed Login Attempts',
        description: 'Number of failed login attempts per day across all systems',
        category_id: operationalCategory?.id,
        measurement_unit: 'count',
        measurement_frequency: MeasurementFrequency.DAILY,
        data_source: 'Security Information and Event Management (SIEM)',
        calculation_method: 'Sum of all failed login attempts across all systems',
        threshold_green: 10,
        threshold_amber: 50,
        threshold_red: 100,
        threshold_direction: 'lower_better',
        current_value: 25,
        current_status: KRIStatus.GREEN,
        trend: KRITrend.STABLE,
        kri_owner_id: riskManager?.id,
        is_active: true,
        target_value: 5,
        baseline_value: 15,
        tags: ['security', 'authentication', 'operational'],
        created_by: adminUser.id,
      },
      {
        kri_id: 'KRI-002',
        name: 'System Uptime Percentage',
        description: 'Percentage of time critical systems are available',
        category_id: operationalCategory?.id,
        measurement_unit: 'percentage',
        measurement_frequency: MeasurementFrequency.DAILY,
        data_source: 'Infrastructure Monitoring System',
        calculation_method: 'Average uptime across all critical systems',
        threshold_green: 99.5,
        threshold_amber: 99.0,
        threshold_red: 95.0,
        threshold_direction: 'higher_better',
        current_value: 99.8,
        current_status: KRIStatus.GREEN,
        trend: KRITrend.IMPROVING,
        kri_owner_id: riskManager?.id,
        is_active: true,
        target_value: 99.9,
        baseline_value: 99.2,
        tags: ['availability', 'operational', 'infrastructure'],
        created_by: adminUser.id,
      },
      {
        kri_id: 'KRI-003',
        name: 'Data Breach Incidents',
        description: 'Number of confirmed data breach incidents per month',
        category_id: operationalCategory?.id,
        measurement_unit: 'count',
        measurement_frequency: MeasurementFrequency.MONTHLY,
        data_source: 'Incident Management System',
        calculation_method: 'Count of confirmed data breach incidents',
        threshold_green: 0,
        threshold_amber: 1,
        threshold_red: 3,
        threshold_direction: 'lower_better',
        current_value: 0,
        current_status: KRIStatus.GREEN,
        trend: KRITrend.STABLE,
        kri_owner_id: riskManager?.id,
        is_active: true,
        target_value: 0,
        baseline_value: 0,
        tags: ['security', 'data-protection', 'incidents'],
        created_by: adminUser.id,
      },
      {
        kri_id: 'KRI-004',
        name: 'Financial Loss from Fraud',
        description: 'Total financial loss from fraud incidents per quarter',
        category_id: financialCategory?.id,
        measurement_unit: 'currency',
        measurement_frequency: MeasurementFrequency.QUARTERLY,
        data_source: 'Finance and Risk Management System',
        calculation_method: 'Sum of all confirmed fraud losses',
        threshold_green: 0,
        threshold_amber: 10000,
        threshold_red: 50000,
        threshold_direction: 'lower_better',
        current_value: 2500,
        current_status: KRIStatus.GREEN,
        trend: KRITrend.IMPROVING,
        kri_owner_id: riskManager?.id,
        is_active: true,
        target_value: 0,
        baseline_value: 5000,
        tags: ['financial', 'fraud', 'loss'],
        created_by: adminUser.id,
      },
      {
        kri_id: 'KRI-005',
        name: 'Customer Satisfaction Score',
        description: 'Average customer satisfaction rating from surveys',
        category_id: strategicCategory?.id,
        measurement_unit: 'score',
        measurement_frequency: MeasurementFrequency.MONTHLY,
        data_source: 'Customer Feedback System',
        calculation_method: 'Average of all customer satisfaction ratings',
        threshold_green: 4.5,
        threshold_amber: 4.0,
        threshold_red: 3.5,
        threshold_direction: 'higher_better',
        current_value: 4.3,
        current_status: KRIStatus.AMBER,
        trend: KRITrend.WORSENING,
        kri_owner_id: riskManager?.id,
        is_active: true,
        target_value: 4.7,
        baseline_value: 4.5,
        tags: ['customer', 'satisfaction', 'strategic'],
        created_by: adminUser.id,
      },
      {
        kri_id: 'KRI-006',
        name: 'Vendor Performance Score',
        description: 'Average performance rating of critical vendors',
        category_id: operationalCategory?.id,
        measurement_unit: 'score',
        measurement_frequency: MeasurementFrequency.QUARTERLY,
        data_source: 'Vendor Management System',
        calculation_method: 'Weighted average of vendor performance metrics',
        threshold_green: 8.0,
        threshold_amber: 7.0,
        threshold_red: 6.0,
        threshold_direction: 'higher_better',
        current_value: 7.5,
        current_status: KRIStatus.AMBER,
        trend: KRITrend.STABLE,
        kri_owner_id: riskManager?.id,
        is_active: true,
        target_value: 8.5,
        baseline_value: 7.2,
        tags: ['vendor', 'supplier', 'operational'],
        created_by: adminUser.id,
      },
      {
        kri_id: 'KRI-007',
        name: 'Compliance Violation Count',
        description: 'Number of compliance violations identified per quarter',
        category_id: operationalCategory?.id,
        measurement_unit: 'count',
        measurement_frequency: MeasurementFrequency.QUARTERLY,
        data_source: 'Compliance Management System',
        calculation_method: 'Count of confirmed compliance violations',
        threshold_green: 0,
        threshold_amber: 2,
        threshold_red: 5,
        threshold_direction: 'lower_better',
        current_value: 1,
        current_status: KRIStatus.GREEN,
        trend: KRITrend.IMPROVING,
        kri_owner_id: riskManager?.id,
        is_active: true,
        target_value: 0,
        baseline_value: 3,
        tags: ['compliance', 'regulatory', 'operational'],
        created_by: adminUser.id,
      },
      {
        kri_id: 'KRI-008',
        name: 'Employee Turnover Rate',
        description: 'Percentage of employees leaving the organization per year',
        category_id: strategicCategory?.id,
        measurement_unit: 'percentage',
        measurement_frequency: MeasurementFrequency.QUARTERLY,
        data_source: 'Human Resources Information System',
        calculation_method: 'Annualized turnover rate',
        threshold_green: 5,
        threshold_amber: 10,
        threshold_red: 15,
        threshold_direction: 'lower_better',
        current_value: 8,
        current_status: KRIStatus.GREEN,
        trend: KRITrend.STABLE,
        kri_owner_id: riskManager?.id,
        is_active: true,
        target_value: 5,
        baseline_value: 9,
        tags: ['hr', 'retention', 'strategic'],
        created_by: adminUser.id,
      },
    ];

    const createdKRIs = await kriRepository.save(kriData);
    console.log(`✓ Created ${createdKRIs.length} KRIs\n`);

    console.log('📋 Created KRIs:');
    createdKRIs.forEach((kri) => {
      console.log(`  - ${kri.kri_id}: ${kri.name} (${kri.current_status})`);
    });

    console.log('\n✅ KRI seeding complete!');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding KRIs:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedKRIs();
}

export { seedKRIs };







