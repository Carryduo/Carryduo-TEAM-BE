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
  };

  static readonly test: CacheModuleOptions = {
    isGlobal: true,
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT_TESET,
    password: process.env.REDIS_PASSWORD,
    ttl: Number(process.env.REDIS_TTL),
    no_ready_check: true,
  };
}
