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
import { Server, Socket } from 'socket.io';
import { RoomRepository } from './room.repository';
import { RandomNameUtil } from '@/common/randomname/random-name.util';

@WebSocketGateway({
  namespace: 'rooms',
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
})
export class RoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomRepository: RoomRepository) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    try {
      const roomId = client.handshake.query.roomId as string;
      const room = await this.roomRepository.findRoom(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      const clientId = client.id;
      await this.roomRepository.joinRoom(clientId, roomId);

      const currentUserCount =
        await this.roomRepository.getCurrentUsers(roomId);
      await client.join(roomId);
      if (client.data.name === undefined) {
        client.data.name = RandomNameUtil.generate();
      }
      client.emit('joinedRoom', {
        roomId: roomId,
        userId: clientId,
        timestamp: new Date(),
      });
      this.server.to(roomId).emit('roomUsersUpdated', {
        roomId,
        userCount: currentUserCount,
      });
    } catch (error) {
      console.error('Error in handleConnection:', error);
      client.send('error', '방 참여에 실패하였습니다.');
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    try {
      const roomId = client.handshake.query.roomId as string;
      const room = await this.roomRepository.findRoom(roomId);

      if (!room) {
        throw new Error('Room not found');
      }

      const clientId = client.id;
      await this.roomRepository.leaveRoom(client.id, roomId);

      const currentUserCount =
        await this.roomRepository.getCurrentUsers(roomId);
      await client.leave(roomId);

      client.emit('leavedRoom', {
        roomId,
        userId: clientId,
        timestamp: new Date(),
      });
      this.server.to(roomId).emit('roomUsersUpdated', {
        roomId,
        userCount: currentUserCount,
      });

      return {
        success: true,
        message: `Successfully left room ${roomId}`,
      };
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; message: string },
  ): Promise<object> {
    try {
      const clientIdForDisplay = client.id.substring(0, 4);
      this.server.to(data.roomId).emit('broadcast', {
        message: data.message,
        userName: client.data.name,
        userId: clientIdForDisplay,
      });
      return {
        success: true,
        message: `Successfully send message: ${data.message}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
