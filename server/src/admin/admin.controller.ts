import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('url')
  async getImageUrl(@Body() albumId: string): Promise<string> {
    const url = await this.adminService.generateImageUrl(albumId);
    return url;
  }
}
