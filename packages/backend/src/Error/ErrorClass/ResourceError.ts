import { BaseError } from './BaseError';

/**
 * failed to request resource from external service
 */
class ResourceError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceError';
    Object.setPrototypeOf(this, ResourceError.prototype);
  }
}

export { ResourceError };
