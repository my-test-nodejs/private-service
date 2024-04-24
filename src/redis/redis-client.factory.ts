import { FactoryProvider } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from './redis-client.type';
import { createClient } from 'redis';

export const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const client = createClient({
      url: 'redis://default:kRVD0LhCN3Lhyg8QlqGGwiaCFRjaxnWZ@redis-11410.c241.us-east-1-4.ec2.cloud.redislabs.com:11410',
    });

    await client.connect();
    return client;
  },
};
