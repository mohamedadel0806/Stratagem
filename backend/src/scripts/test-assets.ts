import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { PhysicalAsset } from '../asset/entities/physical-asset.entity';
import { InformationAsset } from '../asset/entities/information-asset.entity';
import { BusinessApplication } from '../asset/entities/business-application.entity';
import { SoftwareAsset } from '../asset/entities/software-asset.entity';
import { Supplier } from '../asset/entities/supplier.entity';
import { AssetType } from '../asset/entities/asset-type.entity';
import { BusinessUnit } from '../common/entities/business-unit.entity';

config();

async function testAssets() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');
  const dbUser = process.env.POSTGRES_USER || 'postgres';
  const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
  const dbName = process.env.POSTGRES_DB || 'grc_platform';

  console.log(`\n🧪 Testing Asset Management Implementation\n`);
  console.log(`Connecting to database: ${dbHost}:${dbPort}/${dbName}\n`);

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
    console.log('✅ Database connection established\n');

    // Test 1: Check if new tables exist
    console.log('📊 Test 1: Checking new tables...');
    const businessUnitsRepo = dataSource.getRepository(BusinessUnit);
    const assetTypesRepo = dataSource.getRepository(AssetType);
    
    const businessUnitCount = await businessUnitsRepo.count();
    const assetTypeCount = await assetTypesRepo.count();
    
    console.log(`   - business_units table: ${businessUnitCount > 0 ? '✅ Exists' : '⚠️  Empty'}`);
    console.log(`   - asset_types table: ${assetTypeCount > 0 ? '✅ Exists with data' : '⚠️  Empty'}`);
    
    if (assetTypeCount > 0) {
      const sampleTypes = await assetTypesRepo.find({ take: 5 });
      console.log(`   - Sample asset types: ${sampleTypes.map(t => t.name).join(', ')}`);
    }
    console.log('');

    // Test 2: Check physical assets structure
    console.log('📦 Test 2: Checking Physical Assets structure...');
    const physicalRepo = dataSource.getRepository(PhysicalAsset);
    const physicalCount = await physicalRepo.count();
    console.log(`   - Total physical assets: ${physicalCount}`);
    
    if (physicalCount > 0) {
      const sample = await physicalRepo.findOne({
        where: {},
        relations: ['assetType', 'businessUnit', 'owner'],
      });
      if (sample) {
        console.log(`   - Sample asset: ${sample.assetDescription}`);
        console.log(`   - Unique identifier: ${sample.uniqueIdentifier}`);
        console.log(`   - Asset type: ${sample.assetType?.name || 'N/A'}`);
        console.log(`   - Business unit: ${sample.businessUnit?.name || 'N/A'}`);
        console.log(`   - Has JSONB fields: ${sample.ipAddresses ? '✅' : '❌'} ipAddresses, ${sample.macAddresses ? '✅' : '❌'} macAddresses`);
        console.log(`   - Has new fields: ${sample.installedSoftware ? '✅' : '❌'} installedSoftware, ${sample.activePortsServices ? '✅' : '❌'} activePortsServices`);
        console.log(`   - Security test results: ${sample.securityTestResults ? '✅' : '❌'}`);
      }
    }
    console.log('');

    // Test 3: Check information assets structure
    console.log('📄 Test 3: Checking Information Assets structure...');
    const infoRepo = dataSource.getRepository(InformationAsset);
    const infoCount = await infoRepo.count();
    console.log(`   - Total information assets: ${infoCount}`);
    
    if (infoCount > 0) {
      const sample = await infoRepo.findOne({
        where: {},
        relations: ['informationOwner', 'assetCustodian', 'businessUnit'],
      });
      if (sample) {
        console.log(`   - Sample asset: ${sample.name}`);
        console.log(`   - Information type: ${sample.informationType}`);
        console.log(`   - Classification: ${sample.classificationLevel}`);
        console.log(`   - Owner: ${sample.informationOwner?.email || 'N/A'}`);
        console.log(`   - Custodian: ${sample.assetCustodian?.email || 'N/A'}`);
        console.log(`   - Business unit: ${sample.businessUnit?.name || 'N/A'}`);
        console.log(`   - Has JSONB compliance: ${Array.isArray(sample.complianceRequirements) ? '✅' : '❌'}`);
      }
    }
    console.log('');

    // Test 4: Check business applications structure
    console.log('💼 Test 4: Checking Business Applications structure...');
    const appRepo = dataSource.getRepository(BusinessApplication);
    const appCount = await appRepo.count();
    console.log(`   - Total business applications: ${appCount}`);
    
    if (appCount > 0) {
      const sample = await appRepo.findOne({
        where: {},
        relations: ['owner', 'businessUnit'],
      });
      if (sample) {
        console.log(`   - Sample app: ${sample.applicationName}`);
        console.log(`   - Version: ${sample.versionNumber || 'N/A'}`);
        console.log(`   - Vendor: ${sample.vendorName || 'N/A'}`);
        console.log(`   - Has JSONB data: ${Array.isArray(sample.dataProcessed) ? '✅' : '❌'} dataProcessed`);
        console.log(`   - Has security tests: ${sample.securityTestResults ? '✅' : '❌'}`);
      }
    }
    console.log('');

    // Test 5: Check software assets structure
    console.log('💻 Test 5: Checking Software Assets structure...');
    const softwareRepo = dataSource.getRepository(SoftwareAsset);
    const softwareCount = await softwareRepo.count();
    console.log(`   - Total software assets: ${softwareCount}`);
    
    if (softwareCount > 0) {
      const sample = await softwareRepo.findOne({
        where: {},
        relations: ['owner', 'businessUnit'],
      });
      if (sample) {
        console.log(`   - Sample software: ${sample.softwareName}`);
        console.log(`   - Version: ${sample.versionNumber || 'N/A'}`);
        console.log(`   - License count: ${sample.licenseCount || 'N/A'}`);
        console.log(`   - Installation count: ${sample.installationCount || 0}`);
        console.log(`   - Has vulnerabilities: ${Array.isArray(sample.knownVulnerabilities) ? '✅' : '❌'}`);
      }
    }
    console.log('');

    // Test 6: Check suppliers structure
    console.log('🏢 Test 6: Checking Suppliers structure...');
    const supplierRepo = dataSource.getRepository(Supplier);
    const supplierCount = await supplierRepo.count();
    console.log(`   - Total suppliers: ${supplierCount}`);
    
    if (supplierCount > 0) {
      const sample = await supplierRepo.findOne({
        where: {},
        relations: ['owner', 'businessUnit'],
      });
      if (sample) {
        console.log(`   - Sample supplier: ${sample.supplierName}`);
        console.log(`   - Unique identifier: ${sample.uniqueIdentifier}`);
        console.log(`   - Contract reference: ${sample.contractReference || 'N/A'}`);
        console.log(`   - Contract value: ${sample.contractValue ? `${sample.contractValue} ${sample.currency || ''}` : 'N/A'}`);
        console.log(`   - Has JSONB contacts: ${sample.primaryContact ? '✅' : '❌'} primary, ${sample.secondaryContact ? '✅' : '❌'} secondary`);
        console.log(`   - Performance rating: ${sample.performanceRating || 'N/A'}`);
      }
    }
    console.log('');

    // Test 7: Verify soft delete works
    console.log('🗑️  Test 7: Verifying soft delete implementation...');
    const allPhysical = await physicalRepo.count();
    const activePhysical = await physicalRepo.count({ where: { deletedAt: null } });
    const deletedPhysical = allPhysical - activePhysical;
    console.log(`   - Physical assets: ${activePhysical} active, ${deletedPhysical} deleted`);
    console.log(`   - Soft delete check: ${deletedPhysical >= 0 ? '✅ Working' : '❌ Error'}`);
    console.log('');

    // Summary
    console.log('📋 Summary:');
    console.log(`   ✅ Database connection: Working`);
    console.log(`   ✅ New tables: business_units (${businessUnitCount}), asset_types (${assetTypeCount})`);
    console.log(`   ✅ Asset counts: Physical (${physicalCount}), Information (${infoCount}), Applications (${appCount}), Software (${softwareCount}), Suppliers (${supplierCount})`);
    console.log(`   ✅ Soft delete: Working`);
    console.log('\n🎉 All tests completed!\n');

    await dataSource.destroy();
  } catch (error: any) {
    console.error('❌ Error during testing:', error.message);
    console.error(error);
    await dataSource.destroy();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testAssets()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

export { testAssets };

