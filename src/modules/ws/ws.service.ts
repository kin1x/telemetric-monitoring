import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { LoggerService } from '../logger/logger.service';
import { WsEvents } from './ws-events.enum';
import { Rooms } from './rooms.enum';

@Injectable()
export class WsService {
  public server: Server = null;

  constructor(private readonly logger: LoggerService) {
    this.logger.init('WsService');
  }

  public async sendToRoom(room: Rooms, event: WsEvents, message: any = null) {
    this.server.to(room).emit(event, message);
  }

  public async sendTopic(topic: string, value: string): Promise<void> {
    await this.sendToRoom(
      Rooms.Topic,
      WsEvents.Topic,
      JSON.stringify({ topic, value }),
    );
  }
}
