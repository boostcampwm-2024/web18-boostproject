import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { Song } from '@/song/song.entity';
import { SongSaveDto } from '@/song/songSave.dto';
import { SongRepository } from '@/song/song.repository';
import { AlbumRepository } from '@/album/album.repository';
import { UploadedFiles } from '@/admin/admin.controller';
import { Album } from '@/album/album.entity';
import { AdminRedisRepository } from '@/admin/admin.redis.repository';

@Injectable()
export class AdminService {
  private s3;

  constructor(
    private configService: ConfigService,
    private readonly songRepository: SongRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly adminRedisRepository: AdminRedisRepository,
  ) {
    this.s3 = new AWS.S3({
      endpoint: new AWS.Endpoint('https://kr.object.ncloudstorage.com'),
      region: 'kr-standard',
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
      },
    });
  }

  private async uploadImageFiles(
    albumCoverFile: Express.Multer.File,
    bannerCoverFile: Express.Multer.File,
    prefix: string,
  ): Promise<{
    albumCoverURL?: string;
    bannerCoverURL?: string;
  }> {
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

  async saveSongs(songs: Song[], albumId: string) {
    songs.forEach((song) => {
      const songDto = new SongSaveDto({ ...song, albumId: albumId });
      this.songRepository.save(new Song(songDto));
    });
  }

  async saveAlbumCoverAndBanner(files: UploadedFiles, albumId: string) {
    const imageUrls: {
      albumCoverURL?: string;
      bannerCoverURL?: string;
    } = await this.uploadImageFiles(
      files.albumCover?.[0],
      files.bannerCover?.[0],
      `converted/${albumId}`,
    );

    await this.albumRepository.updateAlbumUrls(albumId, imageUrls);
  }

  async initializeStreamingSession(processedSongs: Song[], album: Album) {
    const songDurations = processedSongs.map((song) => song.duration);
    const releaseTimestamp = new Date(album.releaseDate).getTime();

    await this.adminRedisRepository.createStreamingSession(
      album.id,
      releaseTimestamp,
      songDurations,
    );
  }
}
