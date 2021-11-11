import { Response } from 'express';
import { logger } from '../../Logger';
import { BaseError } from '../ErrorClass/BaseError';

class ErrorHandler {
  async handleError(err: Error | BaseError, res?: Response) {
    if (res) {
      this.httpErrorHandler(err, res);
    }
    this.logError(err);
  }

  async httpErrorHandler(err: Error | BaseError, res: Response) {
    if (err instanceof BaseError) {
      res.status(err.httpStatusCode || 500).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }

  async logError(err: Error | BaseError) {
    logger.error(err);
  }
}

export { ErrorHandler };
