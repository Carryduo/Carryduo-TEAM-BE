import { CacheModuleOptions } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
export class redisOption {
  static readonly dev: CacheModuleOptions = {
    isGlobal: true,
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    ttl: Number(process.env.REDIS_TTL),
    no_ready_check: true,
    db: process.env.REDIS_DB_NUM,
  };

  static readonly test: CacheModuleOptions = {
    isGlobal: true,
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    ttl: Number(process.env.REDIS_TTL),
    no_ready_check: true,
    db: process.env.REDIS_TEST_DB_NUM,
  };
}
