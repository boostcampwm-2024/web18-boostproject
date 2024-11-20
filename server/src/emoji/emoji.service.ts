import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { EmojiRequestDto } from './emoji-request-dto';

@Injectable()
export class EmojiService {
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

  async generateImageUrl(req: EmojiRequestDto): Promise<string> {
    // URL 유효 시간 = 5분
    const key = `emoji/${req.sessionId}/${req.emojiId}/${req.emojiName}.png`; // TODO : 이모지는 무슨 형식으로 저장해야 하는지 확인

    const s3Params = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: key,
      Expires: this.configService.get<number>('S3_URL_EXPIRATION_SECONDS'),
      ContentType: 'image/png',
    };

    return this.s3.getSignedUrlPromise('putObject', s3Params);
  }
}
