import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from 'src/entities/log.entity';
import { LogTraceEntity } from 'src/entities/log-trace.entity';
import { LoggerModule } from '../logger/logger.module';
import { LogRepository } from './repositories/log.repository';
import { LogService } from './services/log.service';
import { LogController } from './controllers/log.controller';
import { LoggerService } from '../logger/logger.service';
import { LogMapperService } from './services/log-mapper.service';
import { LogTraceRepository } from './repositories/log-trace.repository';
import { TokenEntity } from 'src/entities/token.entity';
import { PermissionEntity } from 'src/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogEntity, LogTraceEntity, TokenEntity, PermissionEntity]),
    LoggerModule,
  ],
  providers: [
    LogRepository,
    LogService,
    LoggerService,
    LogMapperService,
    LogTraceRepository,
  ],
  controllers: [LogController],
  exports: [LogRepository, LogService],
})
export class LogModule {}