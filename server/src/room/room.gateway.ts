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
import * as crypto from 'crypto';
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

      if (!client.data.identifier) {
        client.data.identifier = this.roomService.generateIdentifier(
          client.handshake.address,
        );
      }

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
        client.data.identifier,
      );
      await this.emitVoteUpdateToRoom(roomId, votedTrackNumber);
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
      if (!client.data.identifier) {
        client.data.identifier = this.roomService.generateIdentifier(
          client.handshake.address,
        );
      }
      await this.roomService.updateVote(
        roomId,
        data.trackNumber,
        client.data.identifier,
      );
      await this.emitVoteUpdateToRoom(roomId, data.trackNumber);

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

  async emitVoteUpdateToRoom(roomId: string, trackNumber: string) {
    const voteResult: { [key: string]: string } =
      await this.roomService.getVoteResult(roomId);

    const totalVote = this.getTotalVote(voteResult);

    Object.entries(voteResult).map(([key, value]) => {
      voteResult[key] = `${((Number(value) / totalVote) * 100).toFixed(2)}%`;
    });

    this.server
      .to(roomId)
      .emit('voteUpdated', { votes: voteResult, trackNumber });
  }

  private getTotalVote(voteResult: { [key: string]: string }): number {
    return Object.values(voteResult).reduce(
      (acc, value) => acc + Number(value),
      0,
    );
  }
}
