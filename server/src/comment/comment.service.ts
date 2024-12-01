import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.entity';
import { AlbumCommentResponseDto } from './dto/album-comment-response.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(albumId: string, content: string): Promise<Comment> {
    return await this.commentRepository.createComment({
      albumId,
      content,
    });
  }

  async getAlbumComments(albumId: string): Promise<AlbumCommentResponseDto> {
    const comments = await this.commentRepository.getCommentInfos(albumId);
    return new AlbumCommentResponseDto(comments);
  }
}
