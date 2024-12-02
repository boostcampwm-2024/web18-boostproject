import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { DataSource, Repository } from 'typeorm';
import { AlbumCommentDto } from './dto/album-comment-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createComment(commentData: {
    albumId: string;
    content: string;
  }): Promise<Comment> {
    return await this.commentRepository.save(commentData);
  }

  async getCommentInfos(albumId: string): Promise<AlbumCommentDto[]> {
    const commentInfos = await this.dataSource
      .createQueryBuilder()
      .from(Comment, 'comment')
      .select(['album_id as albumId', 'content', 'created_at as createdAt'])
      .where('album_id = :albumId', { albumId })
      .orderBy('created_at')
      .getRawMany();

    return plainToInstance(AlbumCommentDto, commentInfos);
  }
}
