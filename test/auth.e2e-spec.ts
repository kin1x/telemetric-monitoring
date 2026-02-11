import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTestConfiguration } from '../src/common/testing-utils/create-test-configuration.helper';
import { ServiceTokenEntity } from '../src/modules/auth/entities/service-token.entity';
import { LogEntity } from '../src/entities/log.entity';
import { TokenEntity } from '../src/entities/token.entity';

describe('AuthController (e2e)', () => {
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

  it('/auth/token (POST) should create a token', async () => {
    const createTokenDto = {
      token: 'test-token-1234567890',
      secret: 'test-secret',
      expirationDate: Date.now() + 1000 * 60 * 60, // 1 час
    };

    return request(app.getHttpServer())
      .post('/auth/token')
      .send(createTokenDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Token created');
        expect(res.body.item).toHaveProperty('id');
        expect(res.body.item.token).toBe('test-token-1234567890');
      });
  });

  it('/auth/token (DELETE) should delete a token', async () => {
    const createTokenDto = {
      token: 'test-token-1234567890',
      secret: 'test-secret',
      expirationDate: Date.now() + 1000 * 60 * 60,
    };
    const createResponse = await request(app.getHttpServer())
      .post('/auth/token')
      .send(createTokenDto)
      .expect(201);

    const tokenId = createResponse.body.item.id;

    return request(app.getHttpServer())
      .delete('/auth/token')
      .send({ id: tokenId })
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Token deleted');
        expect(res.body.item.id).toBe(tokenId);
      });
  });

  it('/auth/test (GET) should deny access without valid token', async () => {
    return request(app.getHttpServer())
      .get('/auth/test')
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toContain('Invalid token');
      });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});