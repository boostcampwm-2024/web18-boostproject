import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomRepository } from './room.repository';

@WebSocketGateway({
  namespace: '/rooms',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomRepository: RoomRepository) {}

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
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
  }
  catch(e) {
    return {
      status: 'error',
      message: e.message,
    };
  }
}
