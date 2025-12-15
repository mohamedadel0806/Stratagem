import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { PhysicalAsset } from '../asset/entities/physical-asset.entity';
import { ComplianceFramework } from '../common/entities/compliance-framework.entity';

config();

async function updateAssetCompliance() {
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

    const physicalAssetRepository = dataSource.getRepository(PhysicalAsset);
    const frameworkRepository = dataSource.getRepository(ComplianceFramework);

    // Get all frameworks
    const frameworks = await frameworkRepository.find();
    console.log(`Found ${frameworks.length} compliance frameworks`);

    // Find the specific physical asset
    const assets = await physicalAssetRepository.find();
    const asset = assets.find(a => a.uniqueIdentifier === 'e1001531-a2e5-4859-a2a8-94ea78d5839c');

    if (!asset) {
      console.log('Physical asset not found with ID: e1001531-a2e5-4859-a2a8-94ea78d5839c');
      // Let's try to find any physical asset to update
      const anyAsset = assets[0];
      if (anyAsset) {
        console.log(`Updating physical asset: ${anyAsset.uniqueIdentifier}`);
        // Link to all frameworks (complianceRequirements is now JSONB array)
        anyAsset.complianceRequirements = frameworks.map(f => f.id);
        await physicalAssetRepository.save(anyAsset);
        console.log(`✓ Updated physical asset with ${frameworks.length} compliance frameworks`);
      } else {
        console.log('No physical assets found to update');
      }
    } else {
      console.log(`Updating physical asset: ${asset.uniqueIdentifier}`);
      // Link to all frameworks (complianceRequirements is now JSONB array)
      asset.complianceRequirements = frameworks.map(f => f.id);
      await physicalAssetRepository.save(asset);
      console.log(`✓ Updated physical asset with ${frameworks.length} compliance frameworks`);
    }

    await dataSource.destroy();
  } catch (error) {
    console.error('Error updating asset compliance:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateAssetCompliance()
    .then(() => {
      console.log('Asset compliance update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Asset compliance update failed:', error);
      process.exit(1);
    });
}

export { updateAssetCompliance };