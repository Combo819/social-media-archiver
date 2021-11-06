import { HTTP_STATUS_CODE } from '../../Config/httpCode';

class BaseError extends Error {
  isOperational: boolean;
  httpStatusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'BaseError';
    this.isOperational = false;
    this.httpStatusCode = HTTP_STATUS_CODE.INTERNAL_SERVER;
  }
}

export { BaseError };
