// src/services/ffmpeg.service.ts
import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

@Injectable()
export class FfmpegService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  }

  async convertToHLS(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath, { timeout: 432000 })
        .addOptions([
          '-c:a aac',
          '-b:a 128k',
          '-hls_time 10',
          '-hls_list_size 0',
          '-f hls',
        ])
        .output(outputPath)
        .on('progress', (progress) => {
          console.log('Processing: ', progress.percent, '% done');
        })
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('stderr', (stderrLine) => {
          console.log('FFmpeg stderr:', stderrLine);
        })
        .on('end', () => {
          console.log('Processing finished successfully');
          resolve();
        })
        .on('error', (err, stdout, stderr) => {
          console.error('FFmpeg Error:', err);
          console.error('FFmpeg stdout:', stdout);
          console.error('FFmpeg stderr:', stderr);
          reject(err);
        })
        .run();
    });
  }
}
