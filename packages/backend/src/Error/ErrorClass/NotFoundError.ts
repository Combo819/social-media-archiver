import { HTTP_STATUS_CODE } from '../../Config/httpCode';
import { BaseError } from './BaseError';

class NotFoundError extends BaseError {
  isOperational: boolean;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.httpStatusCode = HTTP_STATUS_CODE.NOT_FOUND;
    this.isOperational = true;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export { NotFoundError };
