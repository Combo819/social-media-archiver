import asyncHandler from 'express-async-handler';
import express, { Request, Response } from 'express';
import { container } from '../../../Config/inversify.config';
import { hideString } from '../../../Utility/hideString';
import { IUser } from '../../User/Types';
import { IAccountService, ACCOUNT_IOC_SYMBOLS } from '../Types';
import {
  BadRequestError,
  NotFoundError,
  ServerError,
} from '../../../Error/ErrorClass';


const accountRouter = express.Router();

accountRouter.get(
  '/profile',
  asyncHandler(async (request: Request, response: Response) => {
    const accoutService = container.get<IAccountService>(
      ACCOUNT_IOC_SYMBOLS.IAccountService,
    );
    const mode = accoutService.getMode();
    let userProfile: IUser | null = null;
    if (mode === 'cookie') {
      userProfile = accoutService.getUserProfile();
    } else {
      throw new BadRequestError(
        `cannot get account's profile in non-cookie mode`,
      );
    }
    if (userProfile) {
      response.send({ result: userProfile });
    } else {
      throw new NotFoundError(`account's profile not found`);
    }
  }),
);

accountRouter.get(
  '/mode',
  asyncHandler(async (request: Request, response: Response) => {
    const accountService = container.get<IAccountService>(
      ACCOUNT_IOC_SYMBOLS.IAccountService,
    );
    const mode = accountService.getMode();
    response.send({ result: mode });
  }),
);

accountRouter.get(
  '/cookie',
  asyncHandler(async (request: Request, response: Response) => {
    const accountService = container.get<IAccountService>(
      ACCOUNT_IOC_SYMBOLS.IAccountService,
    );
    const mode = accountService.getMode();
    let cookie: string = '';
    if (mode === 'cookie') {
      cookie = accountService.getCookie();
    } else {
      throw new BadRequestError(`cannot get cookie in non-cookie mode`);
    }
    if (cookie) {
      response.send({ result: hideString(cookie, 4) });
    } else {
      throw new NotFoundError(`cookie not found`);
    }
  }),
);

accountRouter.post(
  '/cookie/validate',
  asyncHandler(async (request: Request, response: Response) => {
    const { cookie }: { cookie: string } = request.body;
    const accountService = container.get<IAccountService>(
      ACCOUNT_IOC_SYMBOLS.IAccountService,
    );

    const isCookieValid: boolean = await accountService.validateCookie(cookie);
    response.send({ result: isCookieValid });
  }),
);

accountRouter.post(
  '/cookie',
  asyncHandler(async (request: Request, response: Response) => {
    const { cookie }: { cookie: string } = request.body;
    const accountService = container.get<IAccountService>(
      ACCOUNT_IOC_SYMBOLS.IAccountService,
    );
    const hasSetCookie: boolean = await accountService.setCookie(cookie);
    if (hasSetCookie) {
      await accountService.init();
      response.send({ result: true });
    } else {
      throw new ServerError(`failed to set cookie`);
    }
  }),
);

export { accountRouter };
