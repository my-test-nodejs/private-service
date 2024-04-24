import { Module } from '@nestjs/common';
import { RedisServices } from './redis.service';
import { redisClientFactory } from './redis-client.factory';

@Module({
  controllers: [],
  providers: [redisClientFactory, RedisServices],
})
export class RedisModule {}
