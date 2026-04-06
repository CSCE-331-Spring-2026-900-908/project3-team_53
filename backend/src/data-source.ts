import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load .env
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'postgres',
  ssl:
    process.env.DB_SSL === 'true'
      ? {
          rejectUnauthorized:
            process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
        }
      : false,
  synchronize: false, // same as your Nest config
  entities: [
    __dirname + '/**/*.entity.{ts,js}',
  ],
});
