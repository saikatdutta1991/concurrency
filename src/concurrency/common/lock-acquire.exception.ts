import { UnprocessableEntityException } from '@nestjs/common';

export class LockAcquireException extends UnprocessableEntityException {
  constructor(error) {
    super(error);
  }
}
