import { Controller, Get } from '@nestjs/common';
import { AlbumService } from './album.service';
import { MainBannerResponseDto } from './dto/main-banner-response.dto';
import { SideBarResponseDto } from './dto/side-bar-response.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get('banner')
  async getMainBannerInfos(): Promise<MainBannerResponseDto> {
    return await this.albumService.getMainBannerInfos();
  }

  @Get('sidebar')
  async getSideBarInfos() {
    return await this.albumService.getSideBarInfos();
  }
}
