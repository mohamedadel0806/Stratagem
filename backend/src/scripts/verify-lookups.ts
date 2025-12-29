import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { AssetType } from '../asset/entities/asset-type.entity';
import { RiskCategory } from '../risk/entities/risk-category.entity';
import { ControlDomain } from '../governance/domains/entities/domain.entity';
import { Standard } from '../governance/standards/entities/standard.entity';
import { BusinessUnit } from '../common/entities/business-unit.entity';

config();

async function verifyLookups() {
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = parseInt(process.env.DB_PORT || '5432');
    const dbUser = process.env.POSTGRES_USER || 'postgres';
    const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
    const dbName = process.env.POSTGRES_DB || 'grc_platform';

    console.log(`\n🔍 Verifying Lookup Multi-Tenancy\n`);

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

        // Check Global Values (tenant_id IS NULL)
        console.log('--- Global Values (tenant_id IS NULL) ---');

        const assetTypes = await dataSource.getRepository(AssetType).find({ where: { tenantId: null } });
        console.log(`Asset Types: ${assetTypes.length} found. Sample: ${assetTypes.slice(0, 3).map(at => at.name).join(', ')}`);

        const riskCats = await dataSource.getRepository(RiskCategory).find({ where: { tenantId: null } });
        console.log(`Risk Categories: ${riskCats.length} found. Sample: ${riskCats.slice(0, 3).map(rc => rc.name).join(', ')}`);

        const domains = await dataSource.getRepository(ControlDomain).find({ where: { tenantId: null } });
        console.log(`Control Domains: ${domains.length} found. Sample: ${domains.slice(0, 3).map(cd => cd.name).join(', ')}`);

        const standards = await dataSource.getRepository(Standard).find({ where: { tenantId: null } });
        console.log(`Standards: ${standards.length} found. Sample: ${standards.slice(0, 3).map(s => s.title).join(', ')}`);

        const businessUnits = await dataSource.getRepository(BusinessUnit).find({ where: { tenantId: null } });
        console.log(`Business Units (Global): ${businessUnits.length} found.\n`);

        // Check Custom Values (tenant_id IS NOT NULL)
        console.log('--- Custom/Tenant Values (tenant_id IS NOT NULL) ---');

        const customAssetTypes = await dataSource.query('SELECT count(*) as count FROM asset_types WHERE tenant_id IS NOT NULL');
        console.log(`Custom Asset Types: ${customAssetTypes[0].count}`);

        const customRiskCats = await dataSource.query('SELECT count(*) as count FROM risk_categories WHERE tenant_id IS NOT NULL');
        console.log(`Custom Risk Categories: ${customRiskCats[0].count}`);

        const customDomains = await dataSource.query('SELECT count(*) as count FROM control_domains WHERE tenant_id IS NOT NULL');
        console.log(`Custom Control Domains: ${customDomains[0].count}`);

        const customStandards = await dataSource.query('SELECT count(*) as count FROM standards WHERE tenant_id IS NOT NULL');
        console.log(`Custom Standards: ${customStandards[0].count}`);

        const customBusinessUnits = await dataSource.query('SELECT count(*) as count FROM business_units WHERE tenant_id IS NOT NULL');
        console.log(`Custom Business Units: ${customBusinessUnits[0].count}`);

        console.log('\n✅ Verification script complete.');

        await dataSource.destroy();
    } catch (error: any) {
        console.error('❌ Error during verification:', error.message);
        await dataSource.destroy();
    }
}

verifyLookups();
