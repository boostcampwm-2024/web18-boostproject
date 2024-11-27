import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 추가' })
  @ApiParam({ name: 'albumId', required: true, description: '앨범 id' })
  @ApiBody({
    description: '댓글 내용',
    schema: { type: 'object', properties: { content: { type: 'string' } } },
  })
  @Post('/album/:albumId')
  async createComment(
    @Param('albumId') albumId: string,
    @Body('content') content: string,
  ): Promise<any> {
    const commentResponse = await this.commentService.createComment(
      albumId,
      content,
    );
    return {
      success: true,
      commentResponse,
    };
  }
}
