import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigModule } from '@nestjs/config';
import { MyLogger } from './my-logger';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [LoggerService, MyLogger],
  exports: [LoggerService, MyLogger, ConfigModule],
})
export class LoggerModule {}
