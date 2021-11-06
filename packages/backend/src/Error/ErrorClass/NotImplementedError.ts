import { BaseError } from './BaseError';

class NotImplementedError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}

export { NotImplementedError };
