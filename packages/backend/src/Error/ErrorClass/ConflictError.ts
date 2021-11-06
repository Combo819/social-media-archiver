import { HTTP_STATUS_CODE } from '../../Config/httpCode';
import { BaseError } from './BaseError';

class ConflictError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.httpStatusCode = HTTP_STATUS_CODE.CONFLICT;
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export { ConflictError };
