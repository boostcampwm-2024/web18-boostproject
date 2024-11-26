import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('건강 체크')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'health check' })
  @Get('/health')
  healthCheck() {
    return { success: true, health: 'healthy' };
  }
}
