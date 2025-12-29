import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { BusinessUnit } from '../common/entities/business-unit.entity';
import { Tenant, TenantStatus, SubscriptionTier } from '../common/entities/tenant.entity';

config();

async function seed() {
  // Use environment variables from docker-compose or defaults
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

    const userRepository = dataSource.getRepository(User);
    const businessUnitRepository = dataSource.getRepository(BusinessUnit);
    const tenantRepository = dataSource.getRepository(Tenant);

    // Seed Tenant
    console.log('Seeding default tenant...');
    let defaultTenant = await tenantRepository.findOne({ where: { code: 'default-tenant' } });

    if (!defaultTenant) {
      defaultTenant = await tenantRepository.save({
        name: 'Default Tenant',
        code: 'default-tenant',
        status: TenantStatus.ACTIVE,
        subscriptionTier: SubscriptionTier.ENTERPRISE,
        settings: {
          theme: 'system',
          locale: 'en-US'
        }
      });
      console.log(`✓ Created Default Tenant: ${defaultTenant.name}`);
    } else {
      console.log(`Found existing Default Tenant: ${defaultTenant.name}`);
    }

    // Check if users already exist
    const existingUsers = await userRepository.count();
    let createdUsers: User[] = [];

    if (existingUsers > 0) {
      console.log(`Found ${existingUsers} existing users. Ensuring they belong to the specific Default Tenant.`);
      createdUsers = await userRepository.find();

      // Update all users to belong to the default tenant if they don't have one
      for (const user of createdUsers) {
        if (!user.tenant) {
          user.tenant = defaultTenant!;
        }
      }
      createdUsers = await userRepository.save(createdUsers);
      console.log(`✓ Updated ${createdUsers.length} existing users with Default Tenant`);
    } else {
      console.log('Starting database seed...');

      // Hash password for all users (using same password for testing)
      const defaultPassword = await bcrypt.hash('password123', 10);

      // Create users with different roles
      const users = [
        {
          email: 'admin@grcplatform.com',
          firstName: 'Admin',
          lastName: 'User',
          password: defaultPassword,
          role: UserRole.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234567',
          tenant: defaultTenant!,
        },
        {
          email: 'manager@grcplatform.com',
          firstName: 'John',
          lastName: 'Manager',
          password: defaultPassword,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234568',
          tenant: defaultTenant,
        },
        {
          email: 'compliance@grcplatform.com',
          firstName: 'Sarah',
          lastName: 'Compliance',
          password: defaultPassword,
          role: UserRole.COMPLIANCE_OFFICER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234569',
          tenant: defaultTenant,
        },
        {
          email: 'risk@grcplatform.com',
          firstName: 'Ahmed',
          lastName: 'Risk',
          password: defaultPassword,
          role: UserRole.RISK_MANAGER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234570',
          tenant: defaultTenant,
        },
        {
          email: 'auditor@grcplatform.com',
          firstName: 'Fatima',
          lastName: 'Auditor',
          password: defaultPassword,
          role: UserRole.AUDITOR,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234571',
          tenant: defaultTenant,
        },
        {
          email: 'user@grcplatform.com',
          firstName: 'Mohammed',
          lastName: 'User',
          password: defaultPassword,
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234572',
          tenant: defaultTenant,
        },
        {
          email: 'demo@grcplatform.com',
          firstName: 'Demo',
          lastName: 'Account',
          password: defaultPassword,
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          tenant: defaultTenant!,
        },
      ];

      // Insert users
      createdUsers = await userRepository.save(users);
      console.log(`✓ Created ${createdUsers.length} users`);

      // Display created users
      console.log('\n📋 Created Users:');
      createdUsers.forEach((user) => {
        console.log(`  - ${user.email} (${user.role}) - ${user.firstName} ${user.lastName}`);
      });
    }

    // Seed Business Units (must be created before assets that reference them)
    const existingBusinessUnits = await businessUnitRepository.count();
    let businessUnitsMap: Map<string, BusinessUnit> = new Map();

    if (existingBusinessUnits > 0) {
      console.log(`Found ${existingBusinessUnits} existing business units. Skipping business unit creation.`);
      const allBusinessUnits = await businessUnitRepository.find();
      allBusinessUnits.forEach(bu => businessUnitsMap.set(bu.name, bu));
    } else {
      console.log('\n🏢 Seeding business units...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);

      // Get unique business unit names from the seed data
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

      const businessUnitsData = businessUnitNames.map(name => ({
        name,
        code: name.toUpperCase().replace(/\s+/g, '-'),
        description: `${name} business unit`,
        managerId: adminUser?.id,
      }));

      const createdBusinessUnits = await businessUnitRepository.save(businessUnitsData);
      createdBusinessUnits.forEach(bu => businessUnitsMap.set(bu.name, bu));
      console.log(`✓ Created ${createdBusinessUnits.length} business units`);
    }

    console.log('   Email: Any of the emails above');
    console.log('   Password: password123');
    console.log('\n💡 Recommended test accounts:');
    console.log('   - admin@grcplatform.com (Super Admin)');
    console.log('   - compliance@grcplatform.com (Compliance Officer)');
    console.log('   - risk@grcplatform.com (Risk Manager)');
    console.log('   - user@grcplatform.com (Regular User)');

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seed();
