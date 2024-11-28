// test/mock/album.mock.ts
import { AlbumDto } from '@/admin/dto/album.dto';
import { SongDto } from '@/admin/dto/song.dto';
import { UploadedFiles } from '@/admin/admin.controller';

export const createTestSongs = (): SongDto[] => [
  new SongDto(
    'TEST SONG 1',
    1,
    'TEST PRODUCER 1',
    'TEST COMPOSER 1',
    'TEST WRITER 1',
    'Guitar 1, Piano 1',
    'Digital 1',
    'Test lyrics 1 line 1\nTest lyrics 1 line 2',
  ),
  new SongDto(
    'TEST SONG 2',
    2,
    'TEST PRODUCER 2',
    'TEST COMPOSER 2',
    'TEST WRITER 2',
    'Guitar 2, Piano 2',
    'Digital 2',
    'Test lyrics 2 line 1\nTest lyrics 2 line 2',
  ),
];

export const createTestAlbumData = (): AlbumDto => {
  const albumDto = new AlbumDto();
  albumDto.title = 'TEST ALBUM 1';
  albumDto.artist = 'TEST ARTIST 1';
  albumDto.releaseDate = new Date('2024-01-01');
  albumDto.totalTracks = 2;
  albumDto.songs = createTestSongs();
  albumDto.tags = 'K-POP, TEST 1';
  albumDto.totalDuration = 360;
  albumDto.bannerUrl = '';
  albumDto.jacketUrl = '';
  return albumDto;
};

export const createMockFiles = (): UploadedFiles => ({
  albumCover: {
    buffer: Buffer.from('dummy album cover'),
    fieldname: 'albumCover',
    originalname: 'album.jpg',
    mimetype: 'image/jpeg',
    size: 1024,
  } as Express.Multer.File,
  bannerCover: {
    buffer: Buffer.from('dummy banner'),
    fieldname: 'bannerCover',
    originalname: 'banner.jpg',
    mimetype: 'image/jpeg',
    size: 1024,
  } as Express.Multer.File,
  songs: [
    {
      buffer: Buffer.from('dummy song 1'),
      fieldname: 'songs',
      originalname: 'song1.mp3',
      mimetype: 'audio/mpeg',
      size: 1024,
    },
    {
      buffer: Buffer.from('dummy song 2'),
      fieldname: 'songs',
      originalname: 'song2.mp3',
      mimetype: 'audio/mpeg',
      size: 1024,
    },
  ] as Express.Multer.File[],
});
