import { HTTP_STATUS_CODE } from '../../Config/httpCode';
import { BaseError } from './BaseError';

class ServerError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
    this.httpStatusCode = HTTP_STATUS_CODE.INTERNAL_SERVER;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export { ServerError };
