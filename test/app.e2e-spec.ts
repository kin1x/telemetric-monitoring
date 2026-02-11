import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTestConfiguration } from '../src/common/testing-utils/create-test-configuration.helper';
import { ServiceTokenEntity } from '../src/modules/auth/entities/service-token.entity';
import { LogEntity } from '../src/entities/log.entity';
import { TokenEntity } from '../src/entities/token.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot(
          createTestConfiguration([ServiceTokenEntity, LogEntity, TokenEntity]),
        ),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 10000); // Увеличить таймаут до 10 секунд

  it('/health (GET) should return health status', async () => {
    return request(app.getHttpServer())
      .get('/health') // Убедитесь, что эндпоинт существует
      .expect(200)
      .expect((res) => {
        expect(res.text).toMatch(/^OK \d+\.\d+\.\d+$/);
      });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});