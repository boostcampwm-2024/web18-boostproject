import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(albumId: string, content: string): Promise<Comment> {
    return await this.commentRepository.createComment({
      albumId,
      content,
    });
  }
}
