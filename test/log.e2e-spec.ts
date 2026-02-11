import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTestConfiguration } from '../src/common/testing-utils/create-test-configuration.helper';
import { ServiceTokenEntity } from '../src/modules/auth/entities/service-token.entity';
import { LogEntity } from '../src/entities/log.entity';
import { TokenEntity } from '../src/entities/token.entity';
import { LogTypes } from '../src/modules/log/enums/log-types.enum';

describe('LogController (e2e)', () => {
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
  }, 10000); // Увеличить таймаут

  it('/logs (POST) should create a log', async () => {
    const createLogDto = {
      type: LogTypes.INFO,
      message: 'Test log message',
      factory: 'test-factory',
      service: 'test-service',
      environment: 'test-env',
      order: 1,
    };

    return request(app.getHttpServer())
      .post('/logs')
      .send(createLogDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Log item created');
        expect(res.body.item).toHaveProperty('uuid');
        expect(res.body.item.message).toBe('Test log message');
      });
  });

  it('/logs (GET) should return paginated logs', async () => {
    const createLogDto = {
      type: LogTypes.INFO,
      message: 'Test log message',
      factory: 'test-factory',
      service: 'test-service',
      environment: 'test-env',
      order: 1,
    };
    await request(app.getHttpServer()).post('/logs').send(createLogDto).expect(201);

    return request(app.getHttpServer())
      .get('/logs?page=1&pageSize=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Log items list');
        expect(res.body.items).toBeInstanceOf(Array);
        expect(res.body.items.length).toBeGreaterThan(0);
        expect(res.body.pagination).toHaveProperty('totalCount');
      });
  });

  it('/logs/:uuid (GET) should return a log by uuid', async () => {
    const createLogDto = {
      type: LogTypes.INFO,
      message: 'Test log message',
      factory: 'test-factory',
      service: 'test-service',
      environment: 'test-env',
      order: 1,
    };
    const createResponse = await request(app.getHttpServer())
      .post('/logs')
      .send(createLogDto)
      .expect(201);

    const uuid = createResponse.body.item.uuid;

    return request(app.getHttpServer())
      .get(`/logs/${uuid}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Log item found');
        expect(res.body.item.uuid).toBe(uuid);
        expect(res.body.item.message).toBe('Test log message');
      });
  });

  it('/logs/:uuid (PATCH) should update a log', async () => {
    const createLogDto = {
      type: LogTypes.INFO,
      message: 'Test log message',
      factory: 'test-factory',
      service: 'test-service',
      environment: 'test-env',
      order: 1,
    };
    const createResponse = await request(app.getHttpServer())
      .post('/logs')
      .send(createLogDto)
      .expect(201);

    const uuid = createResponse.body.item.uuid;
    const updateLogDto = {
      message: 'Updated log message',
    };

    return request(app.getHttpServer())
      .patch(`/logs/${uuid}`)
      .send(updateLogDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Log item updated');
        expect(res.body.item.uuid).toBe(uuid);
        expect(res.body.item.message).toBe('Updated log message');
      });
  });

  it('/logs/:uuid (DELETE) should delete a log', async () => {
    const createLogDto = {
      type: LogTypes.INFO,
      message: 'Test log message',
      factory: 'test-factory',
      service: 'test-service',
      environment: 'test-env',
      order: 1,
    };
    const createResponse = await request(app.getHttpServer())
      .post('/logs')
      .send(createLogDto)
      .expect(201);

    const uuid = createResponse.body.item.uuid;

    return request(app.getHttpServer())
      .delete(`/logs/${uuid}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Log item deleted');
        expect(res.body.item.uuid).toBe(uuid);
      });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});