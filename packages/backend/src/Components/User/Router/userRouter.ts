import express, { Request, Response } from 'express';
import { container } from '../../../Config/inversify.config';
import asyncHandler from 'express-async-handler';
import { IUser, IUserService, USER_IOC_SYMBOLS } from '../Types';
import os from 'os';
import { BadRequestError } from '../../../Error/ErrorClass';
import path from 'path';
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });
const userRouter = express.Router();

userRouter.get(
  '/',
  asyncHandler(async (request: Request, response: Response) => {
    const username: string = request.query.username as string;
    const userService = container.get<IUserService>(
      USER_IOC_SYMBOLS.IUserService,
    );
    const users: IUser[] = await userService.getUserByName(username);
    const totalNumber: number = await userService.countUserByName(username);

    response.send({ users, totalNumber });
  }),
);

userRouter.get(
  '/export',
  asyncHandler(async (request: Request, response: Response) => {
    const userService = container.get<IUserService>(
      USER_IOC_SYMBOLS.IUserService,
    );
    const fileName: string = `user-v${userService.getVersion()}.json`;
    const data = JSON.stringify(await userService.exportData());
    response.setHeader(
      'Content-disposition',
      `attachment; filename=${fileName}`,
    );
    response.setHeader('Content-type', 'application/json');
    response.write(data, function (err) {
      if (err) {
        throw err;
      }
      response.end();
    });
  }),
);

userRouter.post(
  '/import',
  upload.single('file'),
  asyncHandler(async (request: Request, response: Response) => {
    const batchSize: number = request.body.batchSize || 100;
    const version: number = request.body.version || 0;
    const userService = container.get<IUserService>(
      USER_IOC_SYMBOLS.IUserService,
    );

    const file = (request as any).file;

    const uploadFolder = file?.destination;
    const fileName = file?.filename;
    if (!uploadFolder || !fileName) {
      throw new BadRequestError('Failed to upload file');
    }
    const filePath = path.join(uploadFolder, fileName);
    userService.importData(filePath, version, batchSize);

    response.send('importing users');
  }),
);

export { userRouter };
