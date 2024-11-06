import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

export const createRedisProvider = async (
  configService: ConfigService,
): Promise<RedisClientType> => {
  const client = createClient({
    socket: {
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
    },
    password: configService.get<string>('REDIS_PASSWORD'),
  }) as RedisClientType;

  await client.connect();
  return client;
};