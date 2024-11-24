import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '@/song/song.entity';
import { ORDER } from '@/common/constants/repository.constant';

export class SongRepository {
  constructor(
    @InjectRepository(Song)
    private readonly repository: Repository<Song>,
  ) {}

  async findByIdWithOrderByTrackNumber(
    albumId: string,
    orderBy: keyof typeof ORDER,
  ) {
    return this.repository.find({
      where: { albumId },
      order: { trackNumber: ORDER[orderBy] },
    });
  }
}
