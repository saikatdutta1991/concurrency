import { DynamicModule, Global, Module } from '@nestjs/common';
import { LockService } from './services/lock.service';
import { Redis } from './common/redis';

export class ConcurrencyModule {
  public static register(redisUrl: string): DynamicModule {
    return {
      global: true,
      module: ConcurrencyModule,
      providers: [
        {
          provide: Redis.REDIS,
          useValue: new Redis(redisUrl),
        },
        {
          provide: LockService.LOCK_SERVICE,
          useFactory: redis => new LockService(redis),
          inject: [Redis.REDIS],
        },
      ],
      exports: [LockService.LOCK_SERVICE],
    };
  }
}
