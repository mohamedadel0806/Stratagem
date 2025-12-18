import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

async function checkGovernanceData() {
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
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    // Check Influencers
    const influencerCount = await dataSource.query('SELECT COUNT(*) as count FROM influencers');
    console.log(`📋 Influencers: ${influencerCount[0].count}`);

    // Check Policies (with governance fields)
    const policyCount = await dataSource.query('SELECT COUNT(*) as count FROM policies WHERE version_number IS NOT NULL');
    console.log(`📄 Policies (Governance): ${policyCount[0].count}`);

    // Check Control Objectives
    const controlObjectiveCount = await dataSource.query('SELECT COUNT(*) as count FROM control_objectives');
    console.log(`🎯 Control Objectives: ${controlObjectiveCount[0].count}`);

    // Check Unified Controls
    const unifiedControlCount = await dataSource.query('SELECT COUNT(*) as count FROM unified_controls');
    console.log(`🔒 Unified Controls: ${unifiedControlCount[0].count}`);

    // Check Assessments
    const assessmentCount = await dataSource.query('SELECT COUNT(*) as count FROM assessments');
    console.log(`📊 Assessments: ${assessmentCount[0].count}`);

    // Check Assessment Results
    const assessmentResultCount = await dataSource.query('SELECT COUNT(*) as count FROM assessment_results');
    console.log(`📈 Assessment Results: ${assessmentResultCount[0].count}`);

    // Check Evidence
    const evidenceCount = await dataSource.query('SELECT COUNT(*) as count FROM evidence');
    console.log(`📎 Evidence: ${evidenceCount[0].count}`);

    // Show sample data
    console.log('\n📋 Sample Influencers:');
    const influencers = await dataSource.query('SELECT name, category, status FROM influencers LIMIT 3');
    influencers.forEach((inf: any) => {
      console.log(`   - ${inf.name} (${inf.category}, ${inf.status})`);
    });

    console.log('\n📄 Sample Policies:');
    const policies = await dataSource.query('SELECT title, version, status FROM policies WHERE version_number IS NOT NULL LIMIT 3');
    policies.forEach((pol: any) => {
      console.log(`   - ${pol.title} (v${pol.version}, ${pol.status})`);
    });

    console.log('\n🔒 Sample Unified Controls:');
    const controls = await dataSource.query('SELECT control_identifier, title, status FROM unified_controls LIMIT 3');
    controls.forEach((ctrl: any) => {
      console.log(`   - ${ctrl.control_identifier}: ${ctrl.title} (${ctrl.status})`);
    });

    await dataSource.destroy();
  } catch (error) {
    console.error('Error checking data:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

checkGovernanceData();





