import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSourceOptions, DataSource } from 'typeorm';
import { EnvConfig } from './env.validation';

dotenvConfig({ path: '.env' });

const env = process.env as unknown as EnvConfig;

const config: DataSourceOptions = {
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT),
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: env.ENV === 'development',
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);