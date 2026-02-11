import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  imports: [LoggerModule],
  providers: [WsGateway, WsService],
  exports: [WsService],
})
export class WsModule {}
