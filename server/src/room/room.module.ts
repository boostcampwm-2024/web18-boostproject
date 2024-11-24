import { Module } from '@nestjs/common';
import { RoomRepository } from '@/room/room.repository';
import { RoomGateway } from '@/room/room.gateway';
import { RoomController } from '@/room/room.controller';
import { Room } from '@/room/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomRepository, RoomGateway],
  exports: [TypeOrmModule, RoomRepository],
})
export class RoomModule {}
