import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AdminService {
  private s3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: new AWS.Endpoint('https://kr.object.ncloudstorage.com'),
      region: 'kr-standard',
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
      },
    });
  }

  async uploadImageFiles(
    albumCoverFile: Express.Multer.File,
    bannerCoverFile: Express.Multer.File,
    prefix: string,
  ) {
    const results: {
      albumCoverURL?: string;
      bannerCoverURL?: string;
    } = {};

    if (albumCoverFile) {
      results.albumCoverURL = await this.uploadFile(
        albumCoverFile,
        prefix,
        'cover',
      );
    }

    if (bannerCoverFile) {
      results.bannerCoverURL = await this.uploadFile(
        bannerCoverFile,
        prefix,
        'banner',
      );
    }

    return results;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    fileType: 'cover' | 'banner',
  ): Promise<string> {
    const bucket = this.configService.get<string>('S3_BUCKET_NAME');
    const fileExtension = file.originalname.split('.').pop();
    const key = `${folder}/${fileType}.${fileExtension}`;

    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const result = await this.s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }
}
