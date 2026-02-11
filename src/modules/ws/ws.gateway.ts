import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { LoggerService } from '../logger/logger.service';
import { corsOptionsOrigin } from 'src/config/cors';
import { WsEvents } from './ws-events.enum';
import { Rooms } from './rooms.enum';
import { WsService } from './ws.service';

@WebSocketGateway({
  cors: {
    origin: corsOptionsOrigin,
  },
  // methods: ['GET', 'POST'],
  allowCredentials: true,
})
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly logger: LoggerService,
    private readonly wsSvc: WsService,
  ) {
    this.logger.init('WsGateway');
  }

  @WebSocketServer() server: Server;

  public afterInit() {
    this.wsSvc.server = this.server;
    this.logger.log('Initialized');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  public handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  public handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: 'Wrong data that will make the test fail',
    };
  }

  @SubscribeMessage(WsEvents.JoinRoom)
  async joinRoom(client: Socket, room: Rooms) {
    await client.join(room);
    await this.logger.debug(`client joined to "${room}"`);
    client.emit(WsEvents.JoinRoom, room);
  }

  @SubscribeMessage(WsEvents.LeaveRoom)
  async leaveRoom(client: Socket, room: Rooms) {
    await client.leave(room);
    await this.logger.debug(`client leaved from "${room}"`);
    client.emit(WsEvents.LeaveRoom, room);
  }
}
