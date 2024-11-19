import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';

@Injectable()
export class AdminService {
  private readonly s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      endpoint: this.configService.get('S3_ENDPOINT'),
      region: this.configService.get('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      },
    });
  }

  async generateImageUrl(albumId: string): Promise<string> {
    // URL 유효 시간 = 5분
    const S3_URL_EXPIRATION_SECONDS = 60 * 5;
    const uniqueId = v4();
    const key = `convert/${albumId}/${uniqueId}.png`;

    const s3Params = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: key,
      Expires: S3_URL_EXPIRATION_SECONDS,
      ContentType: 'image/png',
    };

    return this.s3.getSignedUrlPromise('putObject', s3Params);
  }
}
