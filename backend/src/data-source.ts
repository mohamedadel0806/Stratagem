import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

// Parse DATABASE_URL if provided, otherwise use individual env vars or defaults
const parseDatabaseUrl = (url?: string): {
  username?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
} | null => {
  if (!url) return null;
  try {
    const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
      return {
        username: match[1],
        password: match[2],
        host: match[3],
        port: parseInt(match[4]),
        database: match[5],
      };
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
};

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || dbConfig?.host || 'postgres',
  port: parseInt(process.env.DB_PORT || String(dbConfig?.port) || '5432'),
  username: process.env.POSTGRES_USER || dbConfig?.username || 'postgres',
  password: process.env.POSTGRES_PASSWORD || dbConfig?.password || 'password',
  database: process.env.POSTGRES_DB || dbConfig?.database || 'grc_platform',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});











