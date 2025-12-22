import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';

config();

async function resetAdminPassword() {
  const dbHost = process.env.DB_HOST || 'postgres';
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
    console.log('Database connection established');

    const userRepository = dataSource.getRepository(User);
    const adminUser = await userRepository.findOne({
      where: { email: 'admin@grcplatform.com' },
    });

    if (!adminUser) {
      console.error('Admin user not found!');
      process.exit(1);
    }

    // Hash the new password
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    adminUser.password = hashedPassword;
    await userRepository.save(adminUser);

    console.log('✅ Admin password reset successfully!');
    console.log(`   Email: admin@grcplatform.com`);
    console.log(`   Password: ${newPassword}`);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error resetting password:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

resetAdminPassword();







