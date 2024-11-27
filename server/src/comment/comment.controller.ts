import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AlbumCommentResponseDto } from './dto/album-comment-response.dto';

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

  @ApiOperation({ summary: '댓글 불러오기' })
  @ApiParam({ name: 'albumId', required: true, description: '앨범 id' })
  @Get('/album/:albumId')
  async getAlbumComments(
    @Param('albumId') albumId: string,
  ): Promise<AlbumCommentResponseDto> {
    return await this.commentService.getAlbumComments(albumId);
  }
}
