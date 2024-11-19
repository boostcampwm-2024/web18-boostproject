import { IsNotEmpty, IsString } from 'class-validator';

export class EmojiRequestDto {
  @IsString()
  @IsNotEmpty()
  emojiId: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  emojiName: string;
}
