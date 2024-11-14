import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

@Injectable()
export class MusicProcessingSevice {
  private objectStorage: AWS.S3;
  constructor() {
    this.objectStorage = new AWS.S3({
      endpoint: 'https://kr.object.ncloudstorage.com',
      region: 'kr-standard',
      credentials: {
        accessKeyId: process.env.NCP_ACCESS_KEY,
        secretAccessKey: process.env.NCP_SECRET_KEY,
      },
    });
  }

  async processUpload() {
    // 임시 디렉토리를 하나 만들어준다 -> 파싱한 파일 저장용

    // s3에서 저장한 mp3를 받아온다
    const mp3Path = '../../music/Balance.mp3';
    const outputDir = '../../music/convert';

    // HLS 변환 -> 내부 함수:
    await this.convertToHLS(mp3Path, outputDir);

    // 변환된 파일들 S3에 업로드
    await this.uploadConvertedFiles(outputDir);

    // 임시 디렉토리 정리
  }

  private async convertToHLS(mp3Path: string, outputDir: string) {
    // mp3 파일을 m3u8, ts 파일로 변환 -> 만든 임시 디렉토리에다가 저장
    return new Promise((resolve, reject) => {
      ffmpeg(mp3Path)
        .addOptions([
          '-profile:v baseline',
          '-level 3.0',
          '-start_number 0',
          '-hls_time 3',
          '-hls_list_size 0',
          '-f hls',
        ])
        .output(path.join(outputDir, 'playlist.m3u8'))
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }

  private async uploadConvertedFiles(workDir: string, songId: string) {
    // workDir에 있는 파일들을 object storage에 전송
  }
}
