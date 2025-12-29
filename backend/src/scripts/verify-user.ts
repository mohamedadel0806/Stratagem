
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Tenant } from '../common/entities/tenant.entity';
import { config } from 'dotenv';

config();

async function verify() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || 'grc_platform',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
    });

    await dataSource.initialize();
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { email: 'admin@grcplatform.com' },
        relations: ['tenant']
    });

    console.log('User:', {
        email: user?.email,
        tenantId: user?.tenantId,
        tenant: user?.tenant
    });

    await dataSource.destroy();
}

verify();
