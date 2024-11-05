import { Logger, Module } from '@nestjs/common';
import { AudioModule } from './audio.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AudioModule, CommonModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [Logger, AppService],
})
export class AppModule {}
