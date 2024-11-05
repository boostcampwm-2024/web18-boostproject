import { Controller, Get } from '@nestjs/common';
import { join } from 'path';
import { FfmpegService } from './FFmpeg.service';

@Controller('audio')
export class AudioController {
  constructor(private readonly ffmpegService: FfmpegService) {}

  @Get('convert')
  async convertAudio() {
    const inputPath = join(process.cwd(), '/music', 'Balance.mp3');
    const outputPath = join(process.cwd(), '/music/convert', 'output.m3u8');
    console.log(inputPath);
    console.log(outputPath);

    try {
      await this.ffmpegService.convertToHLS(inputPath, outputPath);
      return { message: 'Conversion successful' };
    } catch (error) {
      throw new Error(`Conversion failed: ${error.message}`);
    }
  }
}
