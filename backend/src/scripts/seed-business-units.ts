import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { BusinessUnit } from '../common/entities/business-unit.entity';
import { User, UserRole } from '../users/entities/user.entity';

config();

async function seedBusinessUnits() {
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

    const businessUnitRepository = dataSource.getRepository(BusinessUnit);
    const userRepository = dataSource.getRepository(User);

    // Check if business units already exist
    const existingBusinessUnits = await businessUnitRepository.count();
    
    if (existingBusinessUnits > 0) {
      console.log(`Found ${existingBusinessUnits} existing business units. Skipping.`);
      await dataSource.destroy();
      return;
    }

    console.log('\n🏢 Seeding business units...');
    const adminUser = await userRepository.findOne({ where: { role: UserRole.SUPER_ADMIN } });
    
    // Business units referenced in the seed data
    const businessUnitNames = [
      'IT Operations',
      'Finance',
      'Human Resources',
      'Executive',
      'Customer Relations',
      'Legal',
      'Marketing',
      'Compliance',
      'Sales',
      'Product Development',
      'Business Intelligence',
      'IT Security',
      'Facilities',
    ];

    // Use raw SQL to avoid TypeORM column name issues
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    
    const values = businessUnitNames.map((name, index) => {
      const code = name.toUpperCase().replace(/\s+/g, '-');
      const description = `${name} business unit`;
      const managerId = adminUser?.id || 'NULL';
      return `('${name}', '${code}', '${description}', ${managerId !== 'NULL' ? `'${managerId}'` : 'NULL'}, NOW(), NOW())`;
    }).join(',\n    ');

    const sql = `
      INSERT INTO business_units (name, code, description, manager_id, created_at, updated_at)
      VALUES 
        ${values}
      RETURNING id, name, code;
    `;

    const result = await queryRunner.query(sql);
    await queryRunner.release();
    
    const createdBusinessUnits = result;
    console.log(`✓ Created ${createdBusinessUnits.length} business units:`);
    createdBusinessUnits.forEach(bu => {
      console.log(`  - ${bu.name} (${bu.code})`);
    });

    await dataSource.destroy();
    console.log('\n✅ Business units seeded successfully!');
  } catch (error) {
    console.error('Error seeding business units:', error);
    process.exit(1);
  }
}

seedBusinessUnits();

