import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB ? String(process.env.POSTGRES_DB) : 'grc_platform', // Ensure database is a string with a default value
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Use migrations instead
  logging: process.env.NODE_ENV === 'development',
  namingStrategy: new SnakeNamingStrategy(), // Database uses snake_case columns
};