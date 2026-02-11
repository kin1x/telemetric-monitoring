import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTokenEntity } from './entities/service-token.entity';
import { ServiceTokenRepository } from './repositories/service-token.repository';
import { AuthMapperService } from './services/auth-mapper.service';
import { AuthService } from './services/auth.service';
import { ServiceTokenApiService } from './services/service-token-api.service';
import { ServiceTokenService } from './services/service-token.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    TypeOrmModule.forFeature([ServiceTokenEntity]),
  ],
  providers: [
    ServiceTokenRepository,
    AuthMapperService,
    AuthService,
    ServiceTokenApiService,
    ServiceTokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService], 
})
export class AuthModule {}
