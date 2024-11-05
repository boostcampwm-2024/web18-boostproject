import { Module } from '@nestjs/common';
import { AudioModule } from './audio.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AudioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
