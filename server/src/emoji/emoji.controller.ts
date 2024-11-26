import { Body, Controller, Post } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { EmojiRequestDto } from './dto/emoji-request.dto';

@Controller('emoji')
export class EmojiController {
  constructor(private readonly emojiService: EmojiService) {}

  @Post('url')
  async getImageUrl(@Body() emojiRequest: EmojiRequestDto): Promise<string> {
    const url = await this.emojiService.generateImageUrl(emojiRequest);
    return url;
  }
}
