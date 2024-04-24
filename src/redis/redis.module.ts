import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisClientFactory } from './redis-client.factory';

@Module({
  controllers: [],
  providers: [redisClientFactory, RedisService],
})
export class RedisModule {}
