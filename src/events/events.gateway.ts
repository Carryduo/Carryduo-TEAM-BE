import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  @SubscribeMessage('ping')
  handleTest(@MessageBody() data: string, @ConnectedSocket() socket: Socket) {
    socket.emit('pong', 'hello ping.');
  }

  afterInit(server: any) {
    console.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    socket.emit('hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    socket.emit('bye', socket.nsp.name);
  }
}
