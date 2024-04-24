import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Tokens } from '../types/index';

@Injectable()
export class RedisService {
  constructor(private readonly redisService: RedisService) {}

  async setToken(userId: number, tokens: Tokens): Promise<void> {
    const client = this.redisService.getClient();
    const key = `user_${userId}`;

    // Tokenni Redisga joylash
    await client.set(key, JSON.stringify(tokens), 'EX', 600);
  }

  async getToken(userId: number): Promise<Tokens | null> {
    const client = this.redisService.getClient();
    const key = `user_${userId}`;

    // Redisdan tokenni olish
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteToken(userId: number): Promise<void> {
    const client = this.redisService.getClient();
    const key = `user_${userId}`;

    // Redisdan tokenni o'chirish
    await client.del(key);
  }
}
