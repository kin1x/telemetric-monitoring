import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../config/configuration';
import { MetricsModule } from 'src/common/metrics/metrics.module';
import { LogModule } from '../log/log.module';
import { WsModule } from '../ws/ws.module';
import { AuthModule } from '../auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.postgres.host'),
        port: configService.get<number>('db.postgres.port'),
        username: configService.get<string>('db.postgres.user'),
        password: configService.get<string>('db.postgres.password'),
        database: configService.get<string>('db.postgres.db'),
        synchronize: true,
        autoLoadEntities: true,
        retryAttempts: 6,
        retryDelay: 10000,
      }),
    }),
    MetricsModule, 
    EventEmitterModule.forRoot({
      verboseMemoryLeak: true,
      ignoreErrors: false,
      maxListeners: 10,
    }),
    LogModule,
    WsModule,
    AuthModule,
  ],
})
export class AppModule {}