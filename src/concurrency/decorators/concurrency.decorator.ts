import { Inject } from '@nestjs/common';
import { DEFAULT_LOCK_SECONDS } from '../common/constants';
import { LockAcquireException } from '../common/lock-acquire.exception';
import { LockService } from '../services/lock.service';
import { KeyGenerator } from '../common/types';

export function Concurrency(options: {
  key: string | KeyGenerator;
  autoReleaseAfterSeconds?: number;
  errorMessage?: string;
}): MethodDecorator {
  const LockServiceinjector = Inject(LockService.LOCK_SERVICE);

  return function decorator(
    target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void {
    LockServiceinjector(target, 'lockService');
    const method = descriptor.value;

    descriptor.value = async function wrapper(...args: any[]) {
      const key =
        typeof options.key === 'string'
          ? options.key
          : options.key.apply(this, args);

      const lockService = this.lockService as LockService;

      try {
        await lockService.acquireLock({
          key,
          releaseAfterSeconds:
            options.autoReleaseAfterSeconds || DEFAULT_LOCK_SECONDS,
        });
      } catch (error) {
        if (error instanceof LockAcquireException && options.errorMessage) {
          throw new LockAcquireException(new Error(options.errorMessage));
        }

        throw error;
      }

      try {
        return await method.apply(this, args);
      } finally {
        await lockService.releaseLock(key);
      }
    };
  };
}
