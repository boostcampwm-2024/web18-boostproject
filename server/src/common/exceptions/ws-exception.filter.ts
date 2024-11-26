import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';

@Catch()
export class CustomWsExceptionFilter implements WsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    client.emit('error', {
      error: exception.constructor.name,
      message: exception.message,
      time: exception.time || new Date().toISOString(),
    });
  }
}
