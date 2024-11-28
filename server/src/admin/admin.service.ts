import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { Song } from '@/song/song.entity';
import { SongSaveDto } from '@/song/dto/song-save.dto';
import { SongRepository } from '@/song/song.repository';
import { AlbumRepository } from '@/album/album.repository';
import { UploadedFiles } from '@/admin/admin.controller';
import { Album } from '@/album/album.entity';
import { AdminRedisRepository } from '@/admin/admin.redis.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private s3;

  constructor(
    private configService: ConfigService,
    private readonly songRepository: SongRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly adminRedisRepository: AdminRedisRepository,
    private jwtService: JwtService,
  ) {
    this.s3 = new AWS.S3({
      endpoint: this.configService.get<string>('S3_END_POINT'),
      region: this.configService.get<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
      },
    });
  }

  async login(adminKey: string) {
    const correctHash = this.configService.get<string>('ADMIN_KEY');
    const isValid = await bcrypt.compare(adminKey, correctHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid admin key');
    }
    const expiration = parseInt(this.configService.get('TOKEN_EXPIRATION'));
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      role: 'admin',
      iat: now,
      exp: now + expiration,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      expiresIn: expiration,
    };
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

    const result = await this.s3.upload(uploadParams).promise();
    return result.Location;
  }

  async saveSongs(songs: Song[], albumId: string) {
    console.log('Songs to save:', songs);
    await Promise.all(
      songs.map(async (song) => {
        const songDto = new SongSaveDto({ ...song, albumId: albumId });
        return await this.songRepository.save(new Song(songDto));
      }),
    );
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

    await this.saveAlbumImages(
      albumId,
      imageUrls.albumCoverURL,
      imageUrls.bannerCoverURL,
    );
  }

  private async saveAlbumImages(
    albumId: string,
    coverUrl?: string,
    bannerUrl?: string,
  ) {
    if (coverUrl) {
      await this.albumRepository.updateCoverById(albumId, coverUrl);
    }
    if (bannerUrl) {
      await this.albumRepository.updateBannerById(albumId, bannerUrl);
    }
  }

  async initializeStreamingSession(processedSongs: Song[], album: Album) {
    const songDurations = processedSongs.map((song) => song.duration);
    const releaseTimestamp = album.releaseDate.getTime();

    await this.adminRedisRepository.createStreamingSession(
      album.id,
      releaseTimestamp,
      songDurations,
    );

    const totalDuration = songDurations.reduce((acc, cur) => acc + cur, 0);
    await this.albumRepository.saveTotalDuration(album.id, totalDuration);
  }
}
