import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

export const createRedisProvider = async (
  configService: ConfigService,
): Promise<RedisClientType> => {
  const client = createClient({
    url: 'redis://localhost:6379',
  }) as RedisClientType;

  await client.connect();
  return client;
};
