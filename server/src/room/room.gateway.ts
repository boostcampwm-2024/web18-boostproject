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
import { RoomNotFoundException } from '@/common/exceptions/domain/room/room-not-found.exception';
import { UserRoomInfoNotFoundException } from '@/common/exceptions/domain/room/user-room-info-not-found.exception';
import { RoomService } from '@/room/room.service';
import { UseFilters } from '@nestjs/common';
import { CustomWsExceptionFilter } from '@/common/exceptions/ws-exception.filter';

@UseFilters(CustomWsExceptionFilter)
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

  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly roomService: RoomService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    try {
      const roomId = client.handshake.query.roomId as string;
      const room = await this.roomRepository.findRoom(roomId);
      if (!room) {
        throw new RoomNotFoundException();
      }

      const identifier = this.roomService.generateIdentifier(
        (client.handshake.headers['x-forwarded-for'] as string) || client.id,
      );
      console.log('connect : ' + identifier);

      const clientId = client.id;
      await this.roomRepository.joinRoom(clientId, roomId);

      const currentUserCount =
        await this.roomRepository.getCurrentUsers(roomId);
      await client.join(roomId);
      client.data.name = client.data.name || RandomNameUtil.generate();
      client.emit('joinedRoom', {
        roomId: roomId,
        userId: clientId,
        timestamp: new Date(),
      });
      this.emitUserCountUpdateToRoom(roomId, currentUserCount);
      const votedTrackNumber = await this.roomService.getRoomVoteUser(
        roomId,
        identifier,
      );
      const voteResult = await this.roomService.emitVoteUpdateToRoom(roomId);
      client.emit('voteShow', {
        votes: voteResult,
        trackNumber: votedTrackNumber,
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
        throw new RoomNotFoundException();
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
    } catch (error) {
      console.error('Error in handleDisconnectConnection:', error);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; message: string },
  ): Promise<object> {
    try {
      const identifier = this.roomService.generateIdentifier(
        (client.handshake.headers['x-forwarded-for'] as string) || client.id,
      );
      console.log('message : ' + identifier);

      const clientIdForDisplay = identifier.substring(0, 4);
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

  @SubscribeMessage('vote')
  async handleFavoriteSongVote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { trackNumber: string },
  ): Promise<object> {
    try {
      if (!client.handshake.query.roomId) {
        throw new UserRoomInfoNotFoundException(client.id);
      }

      const roomId = client.handshake.query.roomId as string;
      const identifier = this.roomService.generateIdentifier(
        (client.handshake.headers['x-forwarded-for'] as string) || client.id,
      );
      console.log('vote : ' + identifier);

      await this.roomService.updateVote(roomId, data.trackNumber, identifier);
      const voteResult = await this.roomService.emitVoteUpdateToRoom(roomId);
      client.emit('voteShow', {
        votes: voteResult,
        trackNumber: data.trackNumber,
      });
      this.server.to(roomId).emit('voteUpdated', { votes: voteResult });

      return {
        success: true,
        message: `Successfully vote: ${data.trackNumber}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  emitUserCountUpdateToRoom(roomId: string, currentUserCount: number) {
    this.server.to(roomId).emit('roomUsersUpdated', {
      roomId,
      userCount: currentUserCount,
    });
  }
}
