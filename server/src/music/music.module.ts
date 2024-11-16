import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MusicProcessingSevice } from './music.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [MusicProcessingSevice],
  exports: [MusicProcessingSevice],
})
export class MusicModule {}
