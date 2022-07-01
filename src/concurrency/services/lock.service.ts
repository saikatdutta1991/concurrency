import { Inject, Injectable } from '@nestjs/common';
import { LockAcquireException } from '../common/lock-acquire.exception';
import { Redis } from '../common/redis';

@Injectable()
export class LockService {
  public static readonly LOCK_SERVICE = 'LOCK_SERVICE';

  constructor(@Inject(Redis.REDIS) private readonly redis: Redis) {}

  public async acquireLock(options: {
    key: string;
    releaseAfterSeconds?: number;
  }): Promise<void> {
    const lock = await this.redis.set(
      options.key,
      'true',
      'EX',
      options.releaseAfterSeconds,
      'NX',
    );

    if (lock !== 'OK') {
      throw new LockAcquireException(
        `Failed to acquire lock on ${options.key}`,
      );
    }
  }

  public async releaseLock(key: string): Promise<void> {
    await this.redis.del([key]);
  }
}
