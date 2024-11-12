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
  ) {
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

      await client.join(roomId);

      await this.roomRepository.createRoom(roomId, room);

      this.server.emit('roomCreated', {
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

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    try {
      //Get room by id
      const room = await this.roomRepository.findRoom(data.roomId);

      if (!room) {
        throw new Error('Room not found');
      }

      await this.roomRepository.leaveRoom(data.userId, data.roomId);

      //Leave socket.io room
      await client.leave(data.roomId);

      client.to(data.roomId).emit('userLeft', {
        userId: data.userId,
        roomId: data.roomId,
      });

      return {
        status: 'success',
        message: 'Left room successfully',
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }
}
