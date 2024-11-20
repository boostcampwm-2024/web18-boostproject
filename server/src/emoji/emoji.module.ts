import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmojiService } from './emoji.service';
import { EmojiController } from './emoji.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [EmojiController],
  providers: [EmojiService],
  exports: [EmojiService],
})
export class EmojiModule {}
