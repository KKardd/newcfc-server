import { Injectable } from '@nestjs/common';
import { HealthIndicator } from '@nestjs/terminus';

import { RedisService } from '@/infrastructure/redis/redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  private readonly redisClient;

  constructor(private redisService: RedisService) {
    super();

    this.redisClient = this.redisService.getClient();
  }
}
