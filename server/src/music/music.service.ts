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
import { M3U8Parser } from './parser/m3u8-parser';

@Injectable()
export class MusicService {
  private readonly s3: S3;
  private readonly SEGMENT_DURATION = 2;

  constructor(
    private readonly configService: ConfigService,
    private readonly musicRepository: MusicRepository,
    private readonly m3u8Parser: M3U8Parser,
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

  async generateMusicFile(
    albumId: string,
    joinTimestamp: number,
  ): Promise<string> {
    const songMetadata = await this.musicRepository.findSongByJoinTimestamp(
      albumId,
      joinTimestamp,
    );
    const songIndex = songMetadata.id;

    const cacheKey = `m3u8:${albumId}:${songIndex}`;
    let cachedM3u8 = await this.cacheManager.get<string>(cacheKey);

    // 원본 가져오기
    if (!cachedM3u8) {
      try {
        const s3Response = await this.s3
          .getObject({
            Bucket: this.configService.get('S3_BUCKET_NAME'),
            Key: `converted/${albumId}/${parseInt(songIndex, 10) + 1}/playlist.m3u8`, // 일단 songIndex 경로로 가져옴
          })
          .promise();

        cachedM3u8 = s3Response.Body.toString();
        await this.cacheManager.set(
          cacheKey,
          cachedM3u8,
          songMetadata.duration * 1000,
        );
      } catch (error) {
        throw new NotFoundException(
          `file not found for ${albumId}, song index ${songIndex}`,
        );
      }
    }

    const elapsedTime = joinTimestamp - songMetadata.startTime;
    const skipSegments = Math.floor(
      elapsedTime / (this.SEGMENT_DURATION * 1000),
    );

    return this.m3u8Parser.parse(cachedM3u8, skipSegments, albumId, songIndex);
  }

  async getSegment(
    albumId: string,
    songIndex: string,
    segmentId: string,
  ): Promise<Buffer> {
    const cacheKey = `segment:${albumId}:${songIndex}:${segmentId}`;
    let segment = await this.cacheManager.get<Buffer>(cacheKey);
    if (!segment) {
      try {
        const s3Response = await this.s3
          .getObject({
            Bucket: this.configService.get('S3_BUCKET_NAME'),
            Key: `converted/${albumId}/${parseInt(songIndex, 10) + 1}/playlist${segmentId}.ts`, // 폴더 구조 동기화 필요
          })
          .promise();

        segment = s3Response.Body as Buffer;
        await this.cacheManager.set(cacheKey, segment, 3600000);
      } catch (error) {
        console.error(
          `Failed to fetch segment ${segmentId} for ${albumId}:`,
          error,
        );
        throw new NotFoundException(`Segment not found: ${segmentId}`);
      }
    }

    return segment;
  }
}
