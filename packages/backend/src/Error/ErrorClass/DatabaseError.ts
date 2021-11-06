import { HTTP_STATUS_CODE } from '../../Config/httpCode';
import { BaseError } from './BaseError';

class DatabaseError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export { DatabaseError };
