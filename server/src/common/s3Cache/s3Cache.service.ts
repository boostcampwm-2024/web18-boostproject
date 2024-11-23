import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Cache } from 'cache-manager';

@Injectable()
export class S3CacheService {
  private readonly s3: S3;
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.s3 = new S3({
      endpoint: this.configService.get('S3_END_POINT'),
      region: this.configService.get('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      },
    });
  }

  async fetchFromS3<T extends string | Buffer>({
    cacheKey,
    s3Key,
    cacheTTL,
    transform,
  }: {
    cacheKey: string;
    s3Key: string;
    cacheTTL: number;
    transform: (data: Buffer) => T;
  }): Promise<T> {
    const cached = await this.cacheManager.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const s3Response = await this.s3
        .getObject({
          Bucket: this.configService.get('S3_BUCKET_NAME'),
          Key: s3Key,
        })
        .promise();

      const content = transform(s3Response.Body as Buffer);
      await this.cacheManager.set(cacheKey, content, cacheTTL);
      return content;
    } catch (e) {
      const fileType = cacheKey.startsWith('m3u8:') ? 'M3U8' : 'Segment(ts)';
      throw new NotFoundException(`❗ ${fileType} Not Found : ${s3Key}`);
    }
  }
}
