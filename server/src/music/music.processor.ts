import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import ffmpeg from 'fluent-ffmpeg';
import path, { join } from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MusicProcessingSevice {
  private objectStorage: AWS.S3;
  private bucketName: string;
  constructor(private configService: ConfigService) {
    this.objectStorage = new AWS.S3({
      endpoint: new AWS.Endpoint('https://kr.object.ncloudstorage.com'),
      region: 'kr-standard',
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
      },
    });
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
  }

  async processUpload(
    file: Express.Multer.File,
    tempDir: string,
    songMetaData: { albumId: string; trackNumber: number; title: string },
  ) {
    // 만든 임시 디렉토레이 파일 저장한다
    const inputPath = path.join(tempDir, file.originalname);
    const outputDir = path.join(tempDir, `song-${songMetaData.trackNumber}`);
    //mp3파일 우선 설정
    await fs.writeFile(inputPath, file.buffer);
    //mp3파일을 파싱한 파일들 저장할 디렉토리 설정
    await fs.mkdir(outputDir, { recursive: true });

    // HLS 변환 -> 내부 함수:
    await this.convertToHLS(inputPath, outputDir);

    // 변환된 파일들 S3에 업로드
    const s3DirectoryName = `converted/${songMetaData.albumId}/${songMetaData.title}`;
    await this.uploadConvertedFiles(s3DirectoryName, outputDir);
  }

  private async convertToHLS(mp3Path: string, outputDir: string) {
    // mp3 파일을 m3u8, ts 파일로 변환 -> 만든 임시 디렉토리에다가 저장
    const HLS_SEGMENT_TIME = process.env.HLS_SEGMENT_TIME || '3';

    return new Promise((resolve, reject) => {
      ffmpeg(mp3Path)
        .addOptions([
          '-profile:v baseline',
          '-level 3.0',
          '-start_number 0',
          `-hls_time ${HLS_SEGMENT_TIME}`,
          '-hls_list_size 0',
          '-f hls',
          '-acodec aac',
          '-strict experimental',
        ])
        .output(path.join(outputDir, 'playlist.m3u8'))
        .on('end', resolve)
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .on('stderr', (stderrLine) => {
          console.log('FFmpeg stderr:', stderrLine);
        })
        .run();
    });
  }

  private async uploadConvertedFiles(
    s3DirectoryName: string,
    outputDir: string,
  ) {
    // workDir에 있는 파일들을 object storage에 전송
    const files = await fs.readdir(outputDir);
    const uploadPromises = files.map(async (fileName) => {
      const filePath = path.join(outputDir, fileName);
      const fileStream = fsSync.createReadStream(filePath);

      const contentType = fileName.endsWith('.m3u8')
        ? 'application/x-mpegURL'
        : 'video/MP2T';
      await this.objectStorage
        .putObject({
          Bucket: this.bucketName,
          Key: `${s3DirectoryName}/${fileName}`,
          Body: fileStream,
          ACL: 'public-read',
          ContentType: contentType,
        })
        .promise();

      fileStream.destroy();
    });

    await Promise.all(uploadPromises);
  }
}
