import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { FfmpegService } from './FFmpeg.service';

@Module({
  controllers: [AudioController],
  providers: [FfmpegService],
})
export class AudioModule {}
