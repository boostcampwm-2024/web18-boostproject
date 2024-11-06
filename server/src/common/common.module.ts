import {
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ClsModule, ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { winstonLoggerTransport } from '@/common/logger/logger.config';
import { LoggerContextMiddleware } from '@/common/logger/logger-context.middleware';
const services = [Logger];

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.headers['X-Request-Id'] ?? uuidv4(),
      },
    }),
    WinstonModule.forRootAsync({
      inject: [ClsService],
      useFactory: (clsService: ClsService) => {
        return {
          transports: [winstonLoggerTransport(clsService)],
        };
      },
    }),
  ],
  providers: services,
  exports: services,
})
export class CommonModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
