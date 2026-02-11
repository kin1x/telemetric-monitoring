import { DataSource, DataSourceOptions } from 'typeorm';

export function createTestConfiguration(entities: Function[]): DataSourceOptions {
  return {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'test',
    entities,
    synchronize: true,
    logging: false,
  };
}

import { ServiceTokenEntity } from '../src/modules/auth/entities/service-token.entity';
import { LogEntity } from '../src/entities/log.entity';
import { TokenEntity } from '../src/entities/token.entity';

let dataSource: DataSource;

beforeAll(async () => {
  try {
    dataSource = new DataSource(
      createTestConfiguration([ServiceTokenEntity, LogEntity, TokenEntity]),
    );
    await dataSource.initialize();
  } catch (error) {
    console.error('Failed to initialize dataSource:', error);
    throw error;
  }
}, 10000); // Увеличить таймаут до 10 секунд

beforeEach(async () => {
  if (!dataSource || !dataSource.isInitialized) return;
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  }
});

afterAll(async () => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
});