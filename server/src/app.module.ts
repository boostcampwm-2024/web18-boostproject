import { Logger, Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CommonModule } from '@/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@/common/redis/redis.module';

@Module({
  imports: [CommonModule, ConfigModule.forRoot(), RedisModule],
  controllers: [AppController],
  providers: [Logger, AppService],
})
export class AppModule {}
