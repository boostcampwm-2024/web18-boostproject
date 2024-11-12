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
import { Room } from './room.entity';
import { RandomNameUtil } from '@/common/randomname/random-name.util';

@WebSocketGateway({
  namespace: 'rooms',
  cors: {
    origin: '*',
    credentials: true,
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

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      userId: string;
    },
  ): Promise<{ success: boolean; room?: Room; error?: string }> {
    console.log('createRoom event received', data);
    try {
      const roomId = await this.roomRepository.generateRoomId();
      const name = RandomNameUtil.generate();

      const room = new Room({
        id: roomId,
        name,
        hostId: data.userId,
        createdAt: new Date(),
      });

      await this.roomRepository.createRoom(roomId, room);

      client.emit('roomCreated', {
        roomId: room.id,
        name: room.name,
        hostId: room.hostId,
      });

      return {
        success: true,
        room,
      };
    } catch (error) {
      console.error('Error in createRoom:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
    },
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    console.log('joinRoom event received', data);
    try {
      await this.roomRepository.joinRoom(data.userId, data.roomId);

      await client.join(data.roomId);

      const name = RandomNameUtil.generate();

      client.emit('joinedRoom', {
        roomId: data.roomId,
        userId: data.userId,
        name,
        timestamp: new Date(),
      });
      return {
        success: true,
        message: `Successfully joined room ${data.roomId}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
