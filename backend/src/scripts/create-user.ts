import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';

config();

async function createUser() {
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

    const userRepository = dataSource.getRepository(User);

    // Check if admin user exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@grcplatform.com' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@grcplatform.com');
      console.log('Password: password123');
      await dataSource.destroy();
      return;
    }

    // Create admin user
    const defaultPassword = await bcrypt.hash('password123', 10);

    const adminUser = userRepository.create({
      email: 'admin@grcplatform.com',
      firstName: 'Admin',
      lastName: 'User',
      password: defaultPassword,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });

    await userRepository.save(adminUser);

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@grcplatform.com');
    console.log('Password: password123');

    await dataSource.destroy();
  } catch (error: any) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }
}

createUser();








