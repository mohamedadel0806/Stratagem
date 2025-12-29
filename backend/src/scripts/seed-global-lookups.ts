import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { AssetType, AssetCategory } from '../asset/entities/asset-type.entity';
import { RiskCategory, RiskTolerance } from '../risk/entities/risk-category.entity';
import { ControlDomain } from '../governance/domains/entities/domain.entity';
import { Standard, StandardStatus } from '../governance/standards/entities/standard.entity';
import { BusinessUnit } from '../common/entities/business-unit.entity';

config();

async function seedGlobalLookups() {
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = parseInt(process.env.DB_PORT || '5432');
    const dbUser = process.env.POSTGRES_USER || 'postgres';
    const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
    const dbName = process.env.POSTGRES_DB || 'grc_platform';

    console.log(`\n🌱 Seeding Global Default Lookups\n`);
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

        const assetTypeRepo = dataSource.getRepository(AssetType);
        const riskCategoryRepo = dataSource.getRepository(RiskCategory);
        const controlDomainRepo = dataSource.getRepository(ControlDomain);
        const standardRepo = dataSource.getRepository(Standard);
        const businessUnitRepo = dataSource.getRepository(BusinessUnit);

        // 1. Seed Global Asset Types
        console.log('📦 Seeding Global Asset Types...');
        const assetTypes = [
            { name: 'Laptop', category: AssetCategory.PHYSICAL, description: 'User workstation laptops' },
            { name: 'Server', category: AssetCategory.PHYSICAL, description: 'Physical or virtual servers' },
            { name: 'Workstation', category: AssetCategory.PHYSICAL, description: 'Fixed desktop workstations' },
            { name: 'Mobile Device', category: AssetCategory.PHYSICAL, description: 'Smartphones and tablets' },
            { name: 'Network Device', category: AssetCategory.PHYSICAL, description: 'Routers, switches, firewalls' },
            { name: 'Customer Data', category: AssetCategory.INFORMATION, description: 'Personally Identifiable Information (PII)' },
            { name: 'Financial Records', category: AssetCategory.INFORMATION, description: 'Internal and external financial data' },
            { name: 'Source Code', category: AssetCategory.INFORMATION, description: 'Proprietary application source code' },
            { name: 'ERP System', category: AssetCategory.APPLICATION, description: 'Enterprise Resource Planning software' },
            { name: 'CRM System', category: AssetCategory.APPLICATION, description: 'Customer Relationship Management software' },
            { name: 'Email Service', category: AssetCategory.APPLICATION, description: 'Corporate email communications' },
            { name: 'Operating System', category: AssetCategory.SOFTWARE, description: 'System software (Windows, Linux, macOS)' },
            { name: 'Database Engine', category: AssetCategory.SOFTWARE, description: 'DBMS software (PostgreSQL, Oracle, SQL Server)' },
            { name: 'Cloud Provider', category: AssetCategory.SUPPLIER, description: 'IaaS/PaaS providers (AWS, Azure, GCP)' },
            { name: 'SaaS Vendor', category: AssetCategory.SUPPLIER, description: 'Software as a Service providers' },
        ];

        for (const at of assetTypes) {
            const existing = await assetTypeRepo.findOne({ where: { name: at.name, tenantId: null } });
            if (!existing) {
                await assetTypeRepo.save({ ...at, tenantId: null });
                console.log(`   - Added: ${at.name}`);
            }
        }
        console.log('✅ Asset Types seeded.\n');

        // 2. Seed Global Risk Categories
        console.log('⚠️  Seeding Global Risk Categories...');
        const riskCategories = [
            { name: 'Strategic Risk', code: 'STRAT', description: 'Risks related to business strategy and competition', risk_tolerance: RiskTolerance.MEDIUM },
            { name: 'Operational Risk', code: 'OPER', description: 'Risks related to internal processes and systems', risk_tolerance: RiskTolerance.MEDIUM },
            { name: 'Financial Risk', code: 'FIN', description: 'Risks related to financial loss or market changes', risk_tolerance: RiskTolerance.LOW },
            { name: 'Compliance Risk', code: 'COMP', description: 'Risks related to regulatory and legal requirements', risk_tolerance: RiskTolerance.LOW },
            { name: 'Cybersecurity Risk', code: 'CYBER', description: 'Risks related to cyber attacks and data breaches', risk_tolerance: RiskTolerance.LOW },
            { name: 'Reputational Risk', code: 'REPUT', description: 'Risks related to public perception and brand value', risk_tolerance: RiskTolerance.MEDIUM },
            { name: 'Third Party Risk', code: 'THIRD', description: 'Risks related to vendors and partners', risk_tolerance: RiskTolerance.MEDIUM },
        ];

        for (const rc of riskCategories) {
            const existing = await riskCategoryRepo.findOne({ where: { code: rc.code, tenantId: null } });
            if (!existing) {
                await riskCategoryRepo.save({ ...rc, tenantId: null, is_active: true, display_order: 0 });
                console.log(`   - Added: ${rc.name}`);
            }
        }
        console.log('✅ Risk Categories seeded.\n');

        // 3. Seed Global Control Domains
        console.log('🛡️  Seeding Global Control Domains...');
        const controlDomains = [
            { name: 'Identity & Access Management', code: 'IAM', description: 'Access control and identity verification', display_order: 1 },
            { name: 'Network Security', code: 'NET', description: 'Security of corporate networks and boundaries', display_order: 2 },
            { name: 'Data Protection', code: 'DATA', description: 'Encryption and privacy of sensitive data', display_order: 3 },
            { name: 'Incident Response', code: 'IR', description: 'Detection and handling of security incidents', display_order: 4 },
            { name: 'Physical Security', code: 'PHYS', description: 'Security of office locations and hardware', display_order: 5 },
            { name: 'Governance & Risk', code: 'GRC', description: 'Policy management and risk assessment', display_order: 6 },
        ];

        for (const cd of controlDomains) {
            const existing = await controlDomainRepo.findOne({ where: { code: cd.code, tenantId: null } });
            if (!existing) {
                await controlDomainRepo.save({ ...cd, tenantId: null, is_active: true });
                console.log(`   - Added: ${cd.name}`);
            }
        }
        console.log('✅ Control Domains seeded.\n');

        // 4. Seed Global Standards
        console.log('📜 Seeding Global Standards...');
        const standards = [
            { standard_identifier: 'ISO-27001', title: 'ISO/IEC 27001:2022', description: 'International standard for Information Security Management Systems', version: '2022', status: StandardStatus.PUBLISHED },
            { standard_identifier: 'NIST-CSF', title: 'NIST Cybersecurity Framework v2.0', description: 'Guidance to improve cybersecurity risk management', version: '2.0', status: StandardStatus.PUBLISHED },
            { standard_identifier: 'SOC-2', title: 'SOC 2 Type II', description: 'Security, Availability, Processing Integrity, Confidentiality, and Privacy controls', version: '1.0', status: StandardStatus.PUBLISHED },
            { standard_identifier: 'GDPR', title: 'General Data Protection Regulation', description: 'EU law on data protection and privacy', version: '2016', status: StandardStatus.PUBLISHED },
            { standard_identifier: 'HIPAA', title: 'Health Insurance Portability and Accountability Act', description: 'US law for protecting sensitive patient health information', version: '1996', status: StandardStatus.PUBLISHED },
        ];

        for (const s of standards) {
            const existing = await standardRepo.findOne({ where: { standard_identifier: s.standard_identifier, tenantId: null } });
            if (!existing) {
                await standardRepo.save({ ...s, tenantId: null });
                console.log(`   - Added: ${s.title}`);
            }
        }
        console.log('✅ Standards seeded.\n');

        // 5. Seed Global Business Units (Templates)
        console.log('🏢 Seeding Global Business Unit Templates...');
        const businessUnits = [
            { name: 'Information Technology', code: 'IT', description: 'Technology and infrastructure management' },
            { name: 'Finance', code: 'FIN', description: 'Financial planning and accounting' },
            { name: 'Human Resources', code: 'HR', description: 'People and talent management' },
            { name: 'Legal & Compliance', code: 'LEGAL', description: 'Legal affairs and regulatory compliance' },
            { name: 'Sales & Marketing', code: 'SALES', description: 'Revenue generation and brand management' },
            { name: 'Operations', code: 'OPS', description: 'Core business operations' },
        ];

        for (const bu of businessUnits) {
            const existing = await businessUnitRepo.findOne({ where: { name: bu.name, tenantId: null } });
            if (!existing) {
                await businessUnitRepo.save({ ...bu, tenantId: null });
                console.log(`   - Added: ${bu.name}`);
            }
        }
        console.log('✅ Business Unit Templates seeded.\n');

        console.log('🎉 Global Lookups seeding completed successfully!\n');

        await dataSource.destroy();
    } catch (error: any) {
        console.error('❌ Error during seeding:', error.message);
        console.error(error);
        await dataSource.destroy();
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    seedGlobalLookups()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}
