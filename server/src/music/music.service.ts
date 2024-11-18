import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Cache } from 'cache-manager';
import { MusicRepository } from './music.repository';

@Injectable()
export class MusicService {
  private readonly s3: S3;
  private readonly SEGMENT_DURATION = 2;

  constructor(
    private readonly configService: ConfigService,
    private readonly musicRepository: MusicRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.s3 = new S3({
      endpoint: this.configService.get('S3_ENDPOINT'),
      region: this.configService.get('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      },
    });
  }

  // m3u8 파일 파싱 => 남은 부분만 리턴
  private parseMusicFile(m3u8Content: string, skipSegments: number): string {
    const lines = m3u8Content.split('\n');
    let modifiedM3u8 = '';
    let isSegment = false;
    let segmentCount = 0;
    for (const line of lines) {
      if (line.startsWith('#EXTINF:')) {
        isSegment = true;
        if (segmentCount >= skipSegments) {
          modifiedM3u8 += line + '\n';
        }
      } else if (isSegment) {
        isSegment = false;
        if (segmentCount >= skipSegments) {
          modifiedM3u8 += line + '\n';
        }
        segmentCount++;
      } else if (
        line.startsWith('#EXT-X-TARGETDURATION') ||
        line.startsWith('#EXT-X-VERSION')
      ) {
        modifiedM3u8 += line + '\n';
      } else if (line.startsWith('#EXT-X-MEDIA-SEQUENCE')) {
        modifiedM3u8 += `#EXT-X-MEDIA-SEQUENCE:${skipSegments}\n`;
      } else if (line.trim() !== '') {
        modifiedM3u8 += line + '\n';
      }
    }
    return modifiedM3u8;
  }

  private validatePlayingTime(elapsedTime: number, duration: number): void {
    // 곡이 시작 전일 때
    if (elapsedTime < 0) {
      throw new HttpException(
        'Song has not started yet',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 곡이 끝난 뒤일 때
    if (elapsedTime > duration * 1000) {
      throw new HttpException('Song has already ended', HttpStatus.BAD_REQUEST);
    }
  }

  async generateMusicFile(
    musicId: string,
    joinTimestamp: number,
  ): Promise<string> {
    const songMetadata = await this.musicRepository.getSongMetadata(musicId);

    const cacheKey = `m3u8:${musicId}`;
    let cachedM3u8 = await this.cacheManager.get<string>(cacheKey);

    // 원본 가져오기
    if (!cachedM3u8) {
      try {
        const s3Response = await this.s3
          .getObject({
            Bucket: this.configService.get('S3_BUCKET_NAME'),
            Key: `converted/18dfb0c0-fb45-409c-8bac-a3ff02fef9e0/${musicId}/playlist.m3u8`, // 폴더 구조 동기화 필요
          })
          .promise();

        cachedM3u8 = s3Response.Body.toString();
        await this.cacheManager.set(
          cacheKey,
          cachedM3u8,
          songMetadata.duration * 1000,
        );
      } catch (error) {
        throw new NotFoundException(`file not found for ${musicId}`);
      }
    }

    const elapsedTime = joinTimestamp - songMetadata.startTime;
    this.validatePlayingTime(elapsedTime, songMetadata.duration);
    const skipSegments = Math.floor(
      elapsedTime / (this.SEGMENT_DURATION * 1000),
    );

    return this.parseMusicFile(cachedM3u8, skipSegments);
  }

  async getSegment(musicId: string, segmentId: string): Promise<Buffer> {
    const cacheKey = `segment:${musicId}:${segmentId}`;
    let segment = await this.cacheManager.get<Buffer>(cacheKey);
    if (!segment) {
      try {
        const s3Response = await this.s3
          .getObject({
            Bucket: this.configService.get('S3_BUCKET_NAME'),
            Key: `converted/18dfb0c0-fb45-409c-8bac-a3ff02fef9e0/${musicId}/playlist${segmentId}.ts`, // 폴더 구조 동기화 필요
          })
          .promise();

        segment = s3Response.Body as Buffer;
        await this.cacheManager.set(cacheKey, segment, 3600000);
      } catch (error) {
        console.error(
          `Failed to fetch segment ${segmentId} for ${musicId}:`,
          error,
        );
        throw new NotFoundException(`Segment not found: ${segmentId}`);
      }
    }

    return segment;
  }
}
