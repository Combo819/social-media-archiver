import { HTTP_STATUS_CODE } from '../../Config/httpCode';
import { BaseError } from './BaseError';

class BadRequestError extends BaseError {
  isOperational: boolean;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.isOperational = true;
    this.httpStatusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export { BadRequestError };
