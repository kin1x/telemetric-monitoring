import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { ServiceTokenEntity } from '../modules/auth/entities/service-token.entity';
import { LogEntity } from '../entities/log.entity';
import { TokenEntity } from '../entities/token.entity';
import { EndpointMetric } from '../entities/endpoint-metric.entity';
import { DbMetric } from '../entities/db-metric.entity';
import { LogTraceEntity } from '../entities/log-trace.entity';
import { PermissionEntity } from '../entities/permission.entity';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: process.env.APP_POSTGRES_HOST || 'monitoring',
  port: Number(process.env.APP_POSTGRES_PORT) || 5432,
  username: 'postgres',
  password: '1234',
  database: 'monitoring',
  entities: [
    ServiceTokenEntity,
    LogEntity,
    TokenEntity,
    EndpointMetric,
    DbMetric,
    LogTraceEntity,
    PermissionEntity,
  ],
  migrations: ['dist/migrations/*{.ts,.js}'], 
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: false,
  logging: true,
  retryAttempts: 3,
  retryDelay: 3000,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);