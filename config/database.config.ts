import { registerAs } from '@nestjs/config';

import { join } from 'path';

export default registerAs('database', () => ({
  name: 'default',
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  autoLoadEntities: true,
  retryAttempts: 3,
  entities: [
    join(__dirname, '..', 'apps/api/src/v1', '**', '*.entity.{ts,js}'),
  ],
  migrations: ['database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_history',
  migrationsRun: false,
  logging: false,
  ssl: false,
  extra: {
    // ssl: {
    //   rejectUnauthorized: false,
    //},
  },
  // options: { encrypt: false },
}));
